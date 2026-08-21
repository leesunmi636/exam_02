export async function onRequestPost({ env, request, params }) {
  const { author, content } = await request.json()
  if (!author?.trim() || !content?.trim()) {
    return Response.json({ error: 'author, content are required' }, { status: 400 })
  }

  const createdAt = new Date().toISOString()
  const { results } = await env.DB.prepare(
    'INSERT INTO comments (post_id, author, content, created_at) VALUES (?, ?, ?, ?) RETURNING id, author, content, created_at',
  )
    .bind(params.id, author.trim(), content.trim(), createdAt)
    .all()

  return Response.json(results[0], { status: 201 })
}
