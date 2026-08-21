import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'board-posts'

const seedPosts = [
  {
    id: 3,
    title: 'React 19 새로운 기능 정리',
    author: '김민준',
    content:
      'React 19에서 추가된 useActionState, useOptimistic 훅과 새로운 컴파일러에 대해 정리해봤습니다. 실무에 적용하면서 느낀 점도 함께 공유합니다.',
    createdAt: '2026-08-20T09:30:00',
    comments: [
      {
        id: 1001,
        author: '이수민',
        content: '정리 잘 봤습니다! useOptimistic 예제 코드도 궁금하네요.',
        createdAt: '2026-08-20T10:05:00',
      },
    ],
  },
  {
    id: 2,
    title: 'Vite로 개발 환경 세팅하기',
    author: '이수민',
    content:
      'CRA 대신 Vite를 사용해서 개발 서버를 띄우니 HMR 속도가 체감될 정도로 빨라졌습니다. 설정 방법을 공유합니다.',
    createdAt: '2026-08-19T15:10:00',
    comments: [],
  },
  {
    id: 1,
    title: '게시판 프로젝트 시작합니다',
    author: '관리자',
    content: '오늘부터 이 게시판에서 자유롭게 글을 남겨주세요. 잘 부탁드립니다!',
    createdAt: '2026-08-18T11:00:00',
    comments: [
      { id: 1002, author: '김민준', content: '잘 부탁드립니다!', createdAt: '2026-08-18T11:20:00' },
    ],
  },
]

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore malformed storage and fall back to seed data
  }
  return seedPosts
}

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
                <span className="comment-date">{formatDate(c.createdAt)}</span>
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
          <span className="post-date">{formatDate(post.createdAt)}</span>
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

export default function App() {
  const [posts, setPosts] = useState(loadPosts)
  const [openId, setOpenId] = useState(null)
  const [formMode, setFormMode] = useState(null) // null | 'create' | post-object being edited
  const [deleteTarget, setDeleteTarget] = useState(null) // post being confirmed for deletion

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  }, [posts])

  const handleCreate = (data) => {
    const newPost = { id: Date.now(), createdAt: new Date().toISOString(), ...data }
    setPosts((prev) => [newPost, ...prev])
    setFormMode(null)
  }

  const handleUpdate = (data) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === formMode.id ? { ...p, ...data } : p)),
    )
    setFormMode(null)
  }

  const confirmDelete = () => {
    setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    setOpenId((cur) => (cur === deleteTarget.id ? null : cur))
    setDeleteTarget(null)
  }

  const handleAddComment = (postId, data) => {
    const newComment = { id: Date.now(), createdAt: new Date().toISOString(), ...data }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...(p.comments ?? []), newComment] } : p,
      ),
    )
  }

  const handleDeleteComment = (postId, commentId) => {
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

      {posts.length === 0 ? (
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
