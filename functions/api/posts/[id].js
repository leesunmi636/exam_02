export async function onRequestPut({ env, request, params }) {
  const { title, author, content } = await request.json()
  if (!title?.trim() || !author?.trim() || !content?.trim()) {
    return Response.json({ error: 'title, author, content are required' }, { status: 400 })
  }

  const { results } = await env.DB.prepare(
    'UPDATE posts SET title = ?, author = ?, content = ? WHERE id = ? RETURNING id, title, author, content, created_at',
  )
    .bind(title.trim(), author.trim(), content.trim(), params.id)
    .all()

  if (results.length === 0) {
    return Response.json({ error: 'post not found' }, { status: 404 })
  }
  return Response.json(results[0])
}

export async function onRequestDelete({ env, params }) {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM comments WHERE post_id = ?').bind(params.id),
    env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(params.id),
  ])
  return new Response(null, { status: 204 })
}
