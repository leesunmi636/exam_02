async function withComments(db, posts) {
  if (posts.length === 0) return []
  const ids = posts.map((p) => p.id)
  const placeholders = ids.map(() => '?').join(',')
  const { results: comments } = await db
    .prepare(
      `SELECT id, post_id, author, content, created_at FROM comments WHERE post_id IN (${placeholders}) ORDER BY created_at ASC`,
    )
    .bind(...ids)
    .all()

  return posts.map((post) => ({
    ...post,
    comments: comments
      .filter((c) => c.post_id === post.id)
      .map(({ post_id, ...c }) => c),
  }))
}

export async function onRequestGet({ env }) {
  const { results: posts } = await env.DB.prepare(
    'SELECT id, title, author, content, created_at FROM posts ORDER BY created_at DESC',
  ).all()

  const data = await withComments(env.DB, posts)
  return Response.json(data)
}

export async function onRequestPost({ env, request }) {
  const { title, author, content } = await request.json()
  if (!title?.trim() || !author?.trim() || !content?.trim()) {
    return Response.json({ error: 'title, author, content are required' }, { status: 400 })
  }

  const createdAt = new Date().toISOString()
  const { results } = await env.DB.prepare(
    'INSERT INTO posts (title, author, content, created_at) VALUES (?, ?, ?, ?) RETURNING id, title, author, content, created_at',
  )
    .bind(title.trim(), author.trim(), content.trim(), createdAt)
    .all()

  return Response.json({ ...results[0], comments: [] }, { status: 201 })
}
