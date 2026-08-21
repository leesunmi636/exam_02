import { useEffect, useState } from 'react'

const API_BASE = '/api/posts'

const btn =
  'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition active:scale-[0.97]'
const btnPrimary = `${btn} bg-accent text-white hover:brightness-105`
const btnGhost = `${btn} border border-neutral-200 text-neutral-900 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-900`
const btnDanger = `${btn} border border-neutral-200 text-red-500 hover:border-red-300 hover:bg-red-50 dark:border-neutral-800 dark:hover:bg-red-950/30`
const btnDangerSolid = `${btn} bg-red-500 text-white hover:brightness-105`
const btnSm =
  'rounded-lg px-3 py-1.5 text-xs'

const fieldInput =
  'rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/15 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function PostForm({ initial, onCancel, onSubmit }) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [author, setAuthor] = useState(initial?.author ?? '')
  const [content, setContent] = useState(initial?.content ?? '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !author.trim() || !content.trim()) return
    onSubmit({ title: title.trim(), author: author.trim(), content: content.trim() })
  }

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/45 p-5 backdrop-blur-sm"
      onClick={onCancel}
    >
      <form
        className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-7 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className="mb-5 font-heading text-xl font-medium text-neutral-900 dark:text-neutral-50">
          {initial ? '글 수정' : '새 글 작성'}
        </h2>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-900 dark:text-neutral-50">
            제목
          </span>
          <input
            className={`${fieldInput} w-full`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            autoFocus
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-900 dark:text-neutral-50">
            작성자
          </span>
          <input
            className={`${fieldInput} w-full`}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-900 dark:text-neutral-50">
            내용
          </span>
          <textarea
            className={`${fieldInput} w-full resize-y`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={6}
          />
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className={btnGhost} onClick={onCancel}>
            취소
          </button>
          <button type="submit" className={btnPrimary}>
            {initial ? '수정 완료' : '등록'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ConfirmDialog({ title, message, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/45 p-5 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-7 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 font-heading text-xl font-medium text-neutral-900 dark:text-neutral-50">
          {title}
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-neutral-500">{message}</p>
        <div className="flex justify-end gap-2">
          <button type="button" className={btnGhost} onClick={onCancel}>
            취소
          </button>
          <button type="button" className={btnDangerSolid} onClick={onConfirm}>
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

function CommentSection({ comments, onAdd, onDelete }) {
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!author.trim() || !content.trim()) return
    onAdd({ author: author.trim(), content: content.trim() })
    setContent('')
  }

  return (
    <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
      <h3 className="mb-3 text-xs font-semibold text-neutral-900 dark:text-neutral-50">
        댓글 {comments.length}
      </h3>

      {comments.length > 0 && (
        <ul className="mb-3.5 flex flex-col gap-2.5">
          {comments.map((c) => (
            <li
              key={c.id}
              className="flex items-start justify-between gap-2 rounded-xl bg-neutral-50 px-3 py-2.5 dark:bg-neutral-900"
            >
              <div className="min-w-0">
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-50">
                  {c.author}
                </span>
                <span className="ml-2 text-xs text-neutral-400">
                  {formatDate(c.created_at)}
                </span>
                <p className="mt-1 text-sm break-words whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
                  {c.content}
                </p>
              </div>
              <button
                className="shrink-0 rounded-md px-1.5 py-0.5 text-lg leading-none text-neutral-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                onClick={() => onDelete(c.id)}
                aria-label="댓글 삭제"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          className={`${fieldInput} w-24 shrink-0 px-2.5 py-2`}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="이름"
        />
        <input
          className={`${fieldInput} min-w-0 flex-1 px-2.5 py-2`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button type="submit" className={`${btnPrimary} ${btnSm} shrink-0`}>
          등록
        </button>
      </form>
    </div>
  )
}

function PostRow({ post, isOpen, onToggle, onEdit, onDelete, onAddComment, onDeleteComment }) {
  return (
    <li
      className={`overflow-hidden rounded-2xl border transition ${
        isOpen
          ? 'border-accent/50 shadow-lg shadow-accent/5'
          : 'border-neutral-200 hover:border-accent/50 dark:border-neutral-800'
      }`}
    >
      <button
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        onClick={onToggle}
      >
        <span className="truncate font-medium text-neutral-900 dark:text-neutral-50">
          {post.title}
        </span>
        <span className="flex shrink-0 items-center gap-3 text-xs text-neutral-500">
          <span className="font-medium">{post.author}</span>
          <span>{formatDate(post.created_at)}</span>
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-neutral-200 px-5 pb-5 pt-4 dark:border-neutral-800">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
            {post.content}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button className={`${btnGhost} ${btnSm}`} onClick={onEdit}>
              수정
            </button>
            <button className={`${btnDanger} ${btnSm}`} onClick={onDelete}>
              삭제
            </button>
          </div>

          <CommentSection
            comments={post.comments ?? []}
            onAdd={onAddComment}
            onDelete={onDeleteComment}
          />
        </div>
      )}
    </li>
  )
}

async function apiRequest(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API request failed: ${res.status}`)
  if (res.status === 204) return null
  return res.json()
}

export default function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openId, setOpenId] = useState(null)
  const [formMode, setFormMode] = useState(null) // null | 'create' | post-object being edited
  const [deleteTarget, setDeleteTarget] = useState(null) // post being confirmed for deletion

  useEffect(() => {
    apiRequest(API_BASE)
      .then(setPosts)
      .catch(() => setError('게시글을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (data) => {
    const newPost = await apiRequest(API_BASE, { method: 'POST', body: JSON.stringify(data) })
    setPosts((prev) => [newPost, ...prev])
    setFormMode(null)
  }

  const handleUpdate = async (data) => {
    const updated = await apiRequest(`${API_BASE}/${formMode.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    setPosts((prev) =>
      prev.map((p) => (p.id === formMode.id ? { ...p, ...updated } : p)),
    )
    setFormMode(null)
  }

  const confirmDelete = async () => {
    await apiRequest(`${API_BASE}/${deleteTarget.id}`, { method: 'DELETE' })
    setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    setOpenId((cur) => (cur === deleteTarget.id ? null : cur))
    setDeleteTarget(null)
  }

  const handleAddComment = async (postId, data) => {
    const newComment = await apiRequest(`${API_BASE}/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...(p.comments ?? []), newComment] } : p,
      ),
    )
  }

  const handleDeleteComment = async (postId, commentId) => {
    await apiRequest(`${API_BASE}/${postId}/comments/${commentId}`, { method: 'DELETE' })
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: (p.comments ?? []).filter((c) => c.id !== commentId) }
          : p,
      ),
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-neutral-900 dark:text-neutral-50">
            게시판
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{posts.length}개의 글이 있습니다</p>
        </div>
        <button className={btnPrimary} onClick={() => setFormMode('create')}>
          + 글쓰기
        </button>
      </header>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center text-neutral-500 dark:border-neutral-700">
          <p>불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center text-neutral-500 dark:border-neutral-700">
          <p>{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center text-neutral-500 dark:border-neutral-700">
          <p>아직 작성된 글이 없습니다.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {posts.map((post) => (
            <PostRow
              key={post.id}
              post={post}
              isOpen={openId === post.id}
              onToggle={() => setOpenId((cur) => (cur === post.id ? null : post.id))}
              onEdit={() => setFormMode(post)}
              onDelete={() => setDeleteTarget(post)}
              onAddComment={(data) => handleAddComment(post.id, data)}
              onDeleteComment={(commentId) => handleDeleteComment(post.id, commentId)}
            />
          ))}
        </ul>
      )}

      {formMode === 'create' && (
        <PostForm onCancel={() => setFormMode(null)} onSubmit={handleCreate} />
      )}
      {formMode && formMode !== 'create' && (
        <PostForm
          initial={formMode}
          onCancel={() => setFormMode(null)}
          onSubmit={handleUpdate}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="글 삭제"
          message={`"${deleteTarget.title}" 글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  )
}
