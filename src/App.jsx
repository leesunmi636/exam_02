import { useEffect, useState } from 'react'
import './App.css'

const API_BASE = '/api/posts'

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
    <div className="modal-backdrop" onClick={onCancel}>
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>{initial ? '글 수정' : '새 글 작성'}</h2>

        <label className="field">
          <span>제목</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            autoFocus
          />
        </label>

        <label className="field">
          <span>작성자</span>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </label>

        <label className="field">
          <span>내용</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={6}
          />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            취소
          </button>
          <button type="submit" className="btn btn-primary">
            {initial ? '수정 완료' : '등록'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ConfirmDialog({ title, message, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal modal-confirm" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            취소
          </button>
          <button type="button" className="btn btn-danger-solid" onClick={onConfirm}>
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
    <div className="comment-section">
      <h3 className="comment-heading">댓글 {comments.length}</h3>

      {comments.length > 0 && (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <div className="comment-body">
                <span className="comment-author">{c.author}</span>
                <span className="comment-date">{formatDate(c.created_at)}</span>
                <p className="comment-content">{c.content}</p>
              </div>
              <button
                className="comment-delete"
                onClick={() => onDelete(c.id)}
                aria-label="댓글 삭제"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          className="comment-input comment-input-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="이름"
        />
        <input
          className="comment-input comment-input-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button type="submit" className="btn btn-primary btn-sm">
          등록
        </button>
      </form>
    </div>
  )
}

function PostRow({ post, isOpen, onToggle, onEdit, onDelete, onAddComment, onDeleteComment }) {
  return (
    <li className={`post-row ${isOpen ? 'open' : ''}`}>
      <button className="post-summary" onClick={onToggle}>
        <span className="post-title">{post.title}</span>
        <span className="post-meta">
          <span className="post-author">{post.author}</span>
          <span className="post-date">{formatDate(post.created_at)}</span>
        </span>
      </button>

      {isOpen && (
        <div className="post-detail">
          <p>{post.content}</p>
          <div className="post-detail-actions">
            <button className="btn btn-ghost btn-sm" onClick={onEdit}>
              수정
            </button>
            <button className="btn btn-danger btn-sm" onClick={onDelete}>
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
    <div className="board">
      <header className="board-header">
        <div>
          <h1 className="board-title">게시판</h1>
          <p className="board-subtitle">{posts.length}개의 글이 있습니다</p>
        </div>
        <button className="btn btn-primary" onClick={() => setFormMode('create')}>
          + 글쓰기
        </button>
      </header>

      {loading ? (
        <div className="empty-state">
          <p>불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p>{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <p>아직 작성된 글이 없습니다.</p>
        </div>
      ) : (
        <ul className="post-list">
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
