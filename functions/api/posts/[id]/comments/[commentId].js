export async function onRequestDelete({ env, params }) {
  await env.DB.prepare('DELETE FROM comments WHERE id = ? AND post_id = ?')
    .bind(params.commentId, params.id)
    .run()
  return new Response(null, { status: 204 })
}
