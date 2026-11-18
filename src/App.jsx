import { useEffect, useRef, useState } from 'react'

const API = 'https://rickandmortyapi.com/api/character'

function App() {
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [retry, setRetry] = useState(0)
  const [request, setRequest] = useState({ state: 'loading' })
  const [selectedId, setSelectedId] = useState(null)
  const [detailRetry, setDetailRetry] = useState(0)
  const [detail, setDetail] = useState({ state: 'loading' })
  const dialogRef = useRef(null)

  useEffect(() => {
    if (selectedId !== null) dialogRef.current.showModal()
  }, [selectedId])

  useEffect(() => {
    let ignore = false

    async function loadCharacters() {
      setRequest({ state: 'loading' })
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set('name', search)
      if (status) params.set('status', status)

      try {
        const response = await fetch(`${API}?${params}`)
        if (response.status === 404) {
          if (!ignore) setRequest({ state: 'empty' })
          return
        }
        if (!response.ok) throw new Error('Could not load characters.')
        const data = await response.json()
        if (!ignore) setRequest({ state: 'success', data })
      } catch {
        if (!ignore) setRequest({ state: 'error' })
      }
    }

    loadCharacters()
    return () => {
      ignore = true
    }
  }, [page, search, status, retry])

  useEffect(() => {
    if (selectedId === null) return
    let ignore = false

    async function loadDetail() {
      setDetail({ state: 'loading' })
      try {
        const response = await fetch(`${API}/${selectedId}`)
        if (!response.ok) throw new Error('Could not load character details.')
        const data = await response.json()
        if (!ignore) setDetail({ state: 'success', data })
      } catch {
        if (!ignore) setDetail({ state: 'error' })
      }
    }

    loadDetail()
    return () => {
      ignore = true
    }
  }, [selectedId, detailRetry])

  function handleSearch(event) {
    event.preventDefault()
    setPage(1)
    setSearch(input.trim())
  }

  function handleStatus(event) {
    setPage(1)
    setStatus(event.target.value)
  }

  return (
    <main className="container">
      <header className="header">
        <p>Portal Comics &amp; Games</p>
        <h1>Character Lookup</h1>
        <p>Browse Rick and Morty characters.</p>
      </header>

      <section className="lookup" aria-label="Character lookup">
        <form className="filters" onSubmit={handleSearch}>
          <label className="search-field">
            <span>Search by name</span>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Character name" />
          </label>
          <label className="status-field">
            <span>Status</span>
            <select value={status} onChange={handleStatus}>
              <option value="">All statuses</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">unknown</option>
            </select>
          </label>
          <button type="submit">Search</button>
        </form>

        <div className="results-heading">
          <div>
            <h2>Characters</h2>
          </div>
          {request.state === 'success' && <p className="result-count">{request.data.info.count} characters found</p>}
        </div>

        {request.state === 'loading' && <div className="message" role="status"><span className="spinner" /> Loading characters...</div>}
        {request.state === 'error' && (
          <div className="message" role="alert">
            <h3>Couldn't load characters</h3>
            <p>Check your connection and give it another try.</p>
            <button className="secondary-button" onClick={() => setRetry(retry + 1)}>Try again</button>
          </div>
        )}
        {request.state === 'empty' && (
          <div className="message" role="status">
            <h3>No characters found</h3>
            <p>Try a different name or status.</p>
          </div>
        )}
        {request.state === 'success' && (
          <>
            <div className="grid">
              {request.data.results.map((character) => (
                <button className="card" key={character.id} onClick={() => { setDetail({ state: 'loading' }); setSelectedId(character.id) }}>
                  <img src={character.image} alt="" />
                  <div className="card-content">
                    <h3>{character.name}</h3>
                    <p><span className={`status-dot ${character.status.toLowerCase()}`} />{character.status} <span className="separator">·</span> {character.species}</p>
                  </div>
                </button>
              ))}
            </div>
            <nav className="pagination" aria-label="Character pages">
              <button onClick={() => setPage(page - 1)} disabled={!request.data.info.prev}>← Previous</button>
              <span>Page <strong>{page}</strong> of {request.data.info.pages}</span>
              <button onClick={() => setPage(page + 1)} disabled={!request.data.info.next}>Next →</button>
            </nav>
          </>
        )}
      </section>

      {selectedId !== null && (
        <dialog className="modal" ref={dialogRef} aria-label="Character details" onClose={() => setSelectedId(null)}>
            <button className="close-button" onClick={() => setSelectedId(null)} aria-label="Close character details">×</button>
            {detail.state === 'loading' && <div className="message" role="status"><span className="spinner" /> Loading details...</div>}
            {detail.state === 'error' && (
              <div className="message" role="alert">
                <h2 id="detail-title">Couldn't load details</h2>
                <p>Check your connection and give it another try.</p>
                <button className="secondary-button" onClick={() => setDetailRetry(detailRetry + 1)}>Try again</button>
              </div>
            )}
            {detail.state === 'success' && (
              <>
                <img className="detail-image" src={detail.data.image} alt="" />
                <div className="detail-content">
                  <h2 id="detail-title">{detail.data.name}</h2>
                  <p className="detail-status"><span className={`status-dot ${detail.data.status.toLowerCase()}`} />{detail.data.status} · {detail.data.species}</p>
                  <dl>
                    <div><dt>Gender</dt><dd>{detail.data.gender}</dd></div>
                    <div><dt>Origin</dt><dd>{detail.data.origin.name}</dd></div>
                    <div><dt>Current location</dt><dd>{detail.data.location.name}</dd></div>
                    <div><dt>Episodes</dt><dd>{detail.data.episode.length}</dd></div>
                  </dl>
                  <button className="secondary-button" onClick={() => setSelectedId(null)}>Close</button>
                </div>
              </>
            )}
        </dialog>
      )}
    </main>
  )
}

export default App
