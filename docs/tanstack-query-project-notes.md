# TanStack Query Notes for Your React Project

Repo scanned: `react-query-main.zip` / GitHub repo `jspmern/react-query`

Your current project is a beginner learning project using:

- React 18
- React Router DOM v6
- Axios
- `@tanstack/react-query` v5
- `@tanstack/react-query-devtools`
- JSONPlaceholder API
- GitHub users API

This note teaches TanStack Query from beginner to advanced and also explains how to improve your current project.

---

## 1. What problem TanStack Query solves

In React, there are two types of state:

### 1. Client state

This is UI state stored inside the browser.

Examples:

```js
const [isModalOpen, setIsModalOpen] = useState(false)
const [searchText, setSearchText] = useState('')
const [selectedTab, setSelectedTab] = useState('posts')
```

For this, `useState`, `useReducer`, Context, Redux, Zustand are fine.

### 2. Server state

This is data coming from backend/API/database.

Examples:

```js
GET /posts
GET /posts/1
GET /users
DELETE /posts/1
PUT /posts/1
```

Server state is harder because you must handle:

- loading
- error
- retry
- cache
- refetch
- background update
- stale data
- pagination
- mutation success
- mutation error
- optimistic update
- synchronization between multiple components

Without TanStack Query you write this manually:

```js
const [data, setData] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true)
      const response = await api.get('/posts')
      setData(response.data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [])
```

Your `src/component/Post.jsx` currently uses this manual style.

TanStack Query replaces most of this with:

```js
const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: getPosts,
})
```

---

## 2. Your current project structure

Current important files:

```txt
src/
  index.js
  component/
    Layout.jsx
    Header.jsx
    Home.jsx
    Post.jsx
    PostRq.jsx
    Details.jsx
    User.jsx
    Error.jsx
  utilitis/
    Api.js
```

Current routes:

```txt
/         -> Home
/user     -> Infinite GitHub users
/post     -> Manual useEffect fetch
/post-rq  -> TanStack Query posts
/post/:id -> Single post details
```

This is good for learning because you can compare:

- `/post` = old way with `useEffect`
- `/post-rq` = better way with TanStack Query

---

## 3. Installation

Your project already has this installed:

```json
"@tanstack/react-query": "^5.59.20",
"@tanstack/react-query-devtools": "^5.59.20"
```

Command:

```bash
npm i @tanstack/react-query @tanstack/react-query-devtools
```

---

## 4. QueryClient setup

Your `src/index.js` already has this:

```js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  </React.StrictMode>
)
```

### Meaning

`QueryClient` is the central cache manager.

It stores:

- API response cache
- loading state
- error state
- mutation state
- refetch logic

`QueryClientProvider` makes this cache available to the whole React app.

Think of it like Redux Provider, but only for server state.

---

## 5. Recommended production QueryClient setup

Currently you use:

```js
const queryClient = new QueryClient()
```

For learning this is okay. For real projects, use defaults:

```js
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

### Why?

- `staleTime`: data remains fresh for 1 minute
- `gcTime`: unused cache stays for 5 minutes
- `retry`: failed API retries 1 time
- `refetchOnWindowFocus: false`: avoids too many surprise API calls while learning

In production, you choose these values based on data type.

Example:

```js
// user profile changes rarely
staleTime: 1000 * 60 * 5

// live dashboard changes frequently
staleTime: 0
refetchInterval: 5000
```

---

## 6. Most important mental model

TanStack Query is not just an API calling library.

It is a server-state manager.

Flow:

```txt
Component mounts
  -> useQuery runs
  -> queryKey checked in cache
  -> if cache fresh, return cache
  -> if missing/stale, call queryFn
  -> store response in cache
  -> UI updates automatically
```

---

## 7. queryKey explained from scratch

Example from your project:

```js
useQuery({
  queryKey: ['posts', count],
  queryFn: () => postHandler(count),
})
```

`queryKey` is the cache address.

Think of it like a file path:

```txt
['posts']          -> all posts
['posts', 0]       -> posts page starting at 0
['posts', 3]       -> posts page starting at 3
['post', 1]        -> single post 1
['post', 2]        -> single post 2
```

Very important rule:

If your API depends on a value, that value should be in `queryKey`.

Correct:

```js
useQuery({
  queryKey: ['post', id],
  queryFn: () => getSinglePostHandler(id),
})
```

Wrong:

```js
useQuery({
  queryKey: ['post'],
  queryFn: () => getSinglePostHandler(id),
})
```

Why wrong?

Because `/posts/1` and `/posts/2` would share the same cache key.

---

## 8. queryFn explained

`queryFn` is the function that actually calls API.

Example:

```js
const getPosts = async () => {
  const response = await api.get('/posts')
  return response.data
}
```

Then:

```js
useQuery({
  queryKey: ['posts'],
  queryFn: getPosts,
})
```

Important rule:

`queryFn` must return data or throw error.

Do not silently catch errors and return undefined.

Your current `Api.js` has this problem:

```js
try {
  const response = await api.get('/posts')
  return response.data
} catch (err) {
  console.log(err)
}
```

This is not good because React Query cannot properly know the API failed.

Better:

```js
const postHandler = async (count) => {
  const response = await api.get(`/posts?_start=${count}&_limit=3`)
  return response.data
}
```

Axios already throws error automatically for failed status codes.

---

## 9. Correct `Api.js` for your project

Replace `src/utilitis/Api.js` with this improved version:

```js
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

export const githubApi = axios.create({
  baseURL: 'https://api.github.com',
})

export const postHandler = async (start = 0) => {
  const response = await api.get('/posts', {
    params: {
      _start: start,
      _limit: 3,
    },
  })

  return response.data
}

export const getSinglePostHandler = async (id) => {
  const response = await api.get(`/posts/${id}`)
  return response.data
}

export const deleteMethod = async (id) => {
  const response = await api.delete(`/posts/${id}`)
  return response
}

export const editMethod = async (value) => {
  const response = await api.put(`/posts/${value.id}`, value)
  return response.data
}

export const fetchUserHandler = async ({ pageParam = 1 }) => {
  const response = await githubApi.get('/users', {
    params: {
      per_page: 10,
      page: pageParam,
    },
  })

  return response.data
}
```

### Main fixes

1. No unnecessary `try/catch`
2. Errors are thrown to React Query
3. Base URLs are clean
4. JSONPlaceholder and GitHub use separate Axios instances
5. `editMethod` sends correct body
6. `fetchUserHandler` directly receives `pageParam`

---

## 10. useQuery states

Example:

```js
const { data, error, isLoading, isFetching, isError, isSuccess } = useQuery({
  queryKey: ['posts'],
  queryFn: postHandler,
})
```

Meaning:

```txt
isLoading  -> first time loading, no data yet
isFetching -> request is running, maybe old data already exists
isError    -> query failed
isSuccess  -> query has data successfully
error      -> actual error object
data       -> response data
```

Simple UI:

```js
if (isLoading) return <h1>Loading...</h1>
if (isError) return <h1>Error: {error.message}</h1>

return <div>{JSON.stringify(data)}</div>
```

---

## 11. staleTime explained very simply

`staleTime` means: how long data is considered fresh.

Default is `0`.

That means data becomes stale immediately after fetch.

Example:

```js
useQuery({
  queryKey: ['posts'],
  queryFn: postHandler,
  staleTime: 1000 * 10,
})
```

Meaning:

```txt
For 10 seconds, data is fresh.
During this time React Query will use cache and avoid refetching automatically.
After 10 seconds, data becomes stale.
```

Important:

Stale does not mean deleted.

Stale means old but still usable.

---

## 12. gcTime explained very simply

`gcTime` means garbage collection time.

It controls how long unused cache remains in memory.

Example:

```js
useQuery({
  queryKey: ['posts'],
  queryFn: postHandler,
  gcTime: 1000 * 60 * 5,
})
```

Meaning:

```txt
If no component is using this query, keep its data in memory for 5 minutes.
After 5 minutes, remove it from cache.
```

Important:

`staleTime` = freshness

`gcTime` = cache memory cleanup

---

## 13. staleTime vs gcTime

| Concept | Meaning | Default |
|---|---|---|
| staleTime | How long data is fresh | 0 ms |
| gcTime | How long inactive cache stays | 5 minutes |

Example:

```js
staleTime: 1000 * 60 * 2,
gcTime: 1000 * 60 * 10,
```

Meaning:

```txt
Data fresh for 2 minutes.
If page unmounts, unused data remains cached for 10 minutes.
```

---

## 14. Your `PostRq.jsx` explained

Your current code:

```js
let { data, error, isLoading } = useQuery({
  queryKey: ['posts', count],
  queryFn: () => postHandler(count),
  placeholderData: keepPreviousData,
})
```

This is good.

Meaning:

- `count` controls pagination start
- when count changes, queryKey changes
- React Query calls API again
- `keepPreviousData` keeps old data until new page arrives

Example:

```txt
count = 0 -> /posts?_start=0&_limit=3
count = 3 -> /posts?_start=3&_limit=3
count = 6 -> /posts?_start=6&_limit=3
```

---

## 15. Correct improved `PostRq.jsx`

```jsx
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import React, { useState } from 'react'
import { deleteMethod, editMethod, postHandler } from '../utilitis/Api'
import { Link } from 'react-router-dom'

function PostRq() {
  const [count, setCount] = useState(0)
  const queryClient = useQueryClient()

  const {
    data = [],
    error,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['posts', count],
    queryFn: () => postHandler(count),
    placeholderData: keepPreviousData,
  })

  const deleteHandler = useMutation({
    mutationFn: deleteMethod,
    onSuccess: (_, id) => {
      queryClient.setQueryData(['posts', count], (oldData = []) => {
        return oldData.filter((item) => item.id !== id)
      })
    },
    onError: (error) => {
      alert(error.message || 'Error deleting post')
    },
  })

  const editHandler = useMutation({
    mutationFn: editMethod,
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['posts', count], (oldData = []) => {
        return oldData.map((item) => {
          return item.id === updatedPost.id ? updatedPost : item
        })
      })
    },
    onError: (error) => {
      alert(error.message || 'Error editing post')
    },
  })

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>Error: {error.message}</h1>

  return (
    <div className="container">
      {isFetching && <p>Refreshing...</p>}

      <div className="row d-flex">
        {data.map((item) => {
          return (
            <div
              key={item.id}
              className="col"
              style={{
                minWidth: '100%',
                minHeight: '55px',
                border: '1px solid black',
              }}
            >
              <Link
                to={`/post/${item.id}`}
                style={{ color: 'black', textDecoration: 'none' }}
              >
                <span>{item.id}</span>
                <h1>{item.title}</h1>
              </Link>

              <button
                disabled={deleteHandler.isPending}
                onClick={() => deleteHandler.mutate(item.id)}
              >
                {deleteHandler.isPending ? 'Deleting...' : 'Delete'}
              </button>

              <button
                disabled={editHandler.isPending}
                onClick={() =>
                  editHandler.mutate({
                    userId: item.userId,
                    title: 'Utsav Kumar Jha',
                    body: item.body,
                    id: item.id,
                  })
                }
              >
                {editHandler.isPending ? 'Editing...' : 'Edit'}
              </button>
            </div>
          )
        })}
      </div>

      <br />

      <button disabled={count === 0} onClick={() => setCount((prev) => prev - 3)}>
        Previous
      </button>

      <span> Page {(count / 3) + 1} </span>

      <button onClick={() => setCount((prev) => prev + 3)}>Next</button>
    </div>
  )
}

export default PostRq
```

### Important fixes

Your code uses:

```js
queryClient.setQueriesData(['posts', count], ...)
```

Better for exact query cache update:

```js
queryClient.setQueryData(['posts', count], ...)
```

`setQueriesData` is for updating multiple matching queries.

`setQueryData` is for updating one exact query.

---

## 16. useMutation explained from scratch

`useQuery` is for reading data.

Examples:

```txt
GET /posts
GET /users
GET /products
```

`useMutation` is for changing data.

Examples:

```txt
POST /posts
PUT /posts/1
PATCH /posts/1
DELETE /posts/1
```

Basic example:

```js
const mutation = useMutation({
  mutationFn: createPost,
})

mutation.mutate({ title: 'Hello' })
```

Flow:

```txt
User clicks button
  -> mutate(data)
  -> mutationFn(data) runs
  -> API call happens
  -> onSuccess or onError runs
```

---

## 17. Mutation with invalidateQueries

Most common production approach:

```js
const queryClient = useQueryClient()

const deletePostMutation = useMutation({
  mutationFn: deletePost,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
})
```

Meaning:

```txt
After delete success, mark posts cache old and refetch posts.
```

Use this when backend is source of truth.

---

## 18. Mutation with setQueryData

Fast UI update approach:

```js
onSuccess: (_, id) => {
  queryClient.setQueryData(['posts', count], (oldData = []) => {
    return oldData.filter((post) => post.id !== id)
  })
}
```

Meaning:

```txt
Do not refetch.
Directly update local cache.
```

Use this when you know exactly how cache should change.

---

## 19. invalidateQueries vs setQueryData

| Method | Meaning | When to use |
|---|---|---|
| invalidateQueries | Refetch from server | Safer, backend source of truth |
| setQueryData | Manually update cache | Faster UI, simple predictable update |

For beginner, prefer `invalidateQueries` first.

For advanced UI, use `setQueryData` or optimistic update.

---

## 20. Details page explained

Your current `Details.jsx`:

```js
let { id } = useParams()

let { data, error, isLoading } = useQuery({
  queryKey: ['post', id],
  queryFn: () => getSinglePostHandler(id),
})
```

This is correct.

Because each post detail has separate cache:

```txt
['post', '1']
['post', '2']
['post', '3']
```

Improved version:

```jsx
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getSinglePostHandler } from '../utilitis/Api'

function Details() {
  const { id } = useParams()

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getSinglePostHandler(id),
    enabled: Boolean(id),
  })

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>Error: {error.message}</h1>

  return (
    <div style={{ width: '100%', border: '1px solid black' }}>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
      <NavLink to="/post-rq">Go Back</NavLink>
    </div>
  )
}

export default Details
```

### What is enabled?

```js
enabled: Boolean(id)
```

This means query should run only when `id` exists.

Useful when value comes later from auth, route, search param, or parent API.

---

## 21. Dependent query example

Suppose first you fetch logged-in user, then fetch user orders.

```js
const userQuery = useQuery({
  queryKey: ['me'],
  queryFn: getCurrentUser,
})

const ordersQuery = useQuery({
  queryKey: ['orders', userQuery.data?.id],
  queryFn: () => getOrders(userQuery.data.id),
  enabled: Boolean(userQuery.data?.id),
})
```

Without `enabled`, second API may run with undefined user id.

---

## 22. Pagination in your project

Your current pagination uses `_start` and `_limit`:

```js
postHandler(count)
```

Better naming:

```js
const [page, setPage] = useState(1)

useQuery({
  queryKey: ['posts', page],
  queryFn: () => getPostsByPage(page),
  placeholderData: keepPreviousData,
})
```

API:

```js
export const getPostsByPage = async (page = 1) => {
  const limit = 3
  const start = (page - 1) * limit

  const response = await api.get('/posts', {
    params: {
      _start: start,
      _limit: limit,
    },
  })

  return response.data
}
```

Component:

```jsx
const [page, setPage] = useState(1)

const { data = [], isLoading } = useQuery({
  queryKey: ['posts', page],
  queryFn: () => getPostsByPage(page),
  placeholderData: keepPreviousData,
})
```

This is easier than `count`.

---

## 23. Prefetch next page

Advanced UX improvement:

```js
useEffect(() => {
  queryClient.prefetchQuery({
    queryKey: ['posts', page + 1],
    queryFn: () => getPostsByPage(page + 1),
  })
}, [page, queryClient])
```

Meaning:

```txt
When user is on page 1, silently load page 2.
When user clicks Next, page 2 appears faster.
```

---

## 24. useInfiniteQuery explained

Your `User.jsx` uses `useInfiniteQuery`.

This is used for:

- infinite scroll
- load more button
- chat messages
- product feed
- social media feed

Normal query returns:

```js
data
```

Infinite query returns:

```js
data.pages
```

Example:

```txt
data.pages[0] -> page 1 users
data.pages[1] -> page 2 users
data.pages[2] -> page 3 users
```

---

## 25. Correct improved `User.jsx`

```jsx
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { fetchUserHandler } from '../utilitis/Api'

function User() {
  const {
    hasNextPage,
    error,
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchUserHandler,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined
    },
  })

  useEffect(() => {
    function scrollFunctionHandler() {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1

      if (bottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }

    window.addEventListener('scroll', scrollFunctionHandler)

    return () => {
      window.removeEventListener('scroll', scrollFunctionHandler)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) return <h1>Loading users...</h1>
  if (isError) return <h1>Error: {error.message}</h1>

  return (
    <div>
      {data.pages.map((page, pageIndex) => {
        return (
          <div key={pageIndex}>
            {page.map((user) => {
              return (
                <div key={user.id}>
                  <h1>
                    {user.id} and {user.login}
                  </h1>
                  <img
                    src={user.avatar_url}
                    style={{ height: '55px', width: '55px' }}
                    alt={user.login}
                  />
                </div>
              )
            })}
          </div>
        )
      })}

      {isFetchingNextPage && <h1>Loading more...</h1>}
      {!hasNextPage && <p>No more users</p>}
    </div>
  )
}

export default User
```

### Important fixes

1. Add `initialPageParam: 1`
2. Add `isFetchingNextPage` check before calling `fetchNextPage`
3. Use stable keys
4. Include `fetchNextPage` and `isFetchingNextPage` in dependency array
5. Use `users`, not `user`, as query key because it is list data

---

## 26. React Query Devtools

You already added:

```jsx
<ReactQueryDevtools initialIsOpen={true} />
```

For development this is good.

For normal development, use:

```jsx
<ReactQueryDevtools initialIsOpen={false} />
```

Devtools helps you see:

- query keys
- fresh/stale state
- cached data
- failed queries
- inactive queries
- refetches

As a beginner, keep Devtools open and watch what happens when you navigate between pages.

---

## 27. Important defaults

By default in TanStack Query:

```txt
staleTime = 0
cache/gc time = 5 minutes
retry = 3 times on client
refetch on window focus = true
```

Meaning:

- data becomes stale immediately
- stale data may refetch when component mounts again
- stale data may refetch when browser window is focused
- failed queries retry automatically

This is why sometimes you see API calls happening again.

---

## 28. Why API call happens again when changing route

Suppose you open `/post-rq`, then go `/user`, then come back `/post-rq`.

If data is stale, TanStack Query can refetch.

This is normal.

To reduce this:

```js
useQuery({
  queryKey: ['posts', count],
  queryFn: () => postHandler(count),
  staleTime: 1000 * 60,
})
```

Now data stays fresh for 1 minute.

---

## 29. Refetching manually

```js
const { data, refetch } = useQuery({
  queryKey: ['posts'],
  queryFn: postHandler,
})

<button onClick={() => refetch()}>Refresh</button>
```

Use when user clicks refresh button.

---

## 30. Polling

Polling means call API repeatedly after interval.

Example:

```js
useQuery({
  queryKey: ['dashboard-stats'],
  queryFn: getDashboardStats,
  refetchInterval: 5000,
})
```

Meaning:

```txt
Call dashboard API every 5 seconds.
```

Use cases:

- live order status
- dashboard count
- chat notification count
- payment status

Do not use polling everywhere. It can increase backend load.

---

## 31. Search query with debounce

Example:

```jsx
const [search, setSearch] = useState('')
const [debouncedSearch, setDebouncedSearch] = useState('')

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search)
  }, 500)

  return () => clearTimeout(timer)
}, [search])

const usersQuery = useQuery({
  queryKey: ['users', debouncedSearch],
  queryFn: () => searchUsers(debouncedSearch),
  enabled: debouncedSearch.length > 2,
})
```

Meaning:

- user types
- wait 500ms
- then call API
- do not call API for every key press

---

## 32. select option

`select` transforms response data before component receives it.

Example:

```js
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: getPosts,
  select: (posts) => posts.map((post) => post.title),
})
```

Now `data` is only titles.

Use it when component needs only specific shape.

---

## 33. Query keys in production

For small project this is okay:

```js
['posts']
['post', id]
```

For production, create one file:

```js
// src/queryKeys.js
export const queryKeys = {
  posts: {
    all: ['posts'],
    list: (page) => ['posts', 'list', page],
    detail: (id) => ['posts', 'detail', id],
  },
  users: {
    all: ['users'],
    infinite: ['users', 'infinite'],
  },
}
```

Usage:

```js
useQuery({
  queryKey: queryKeys.posts.detail(id),
  queryFn: () => getSinglePostHandler(id),
})
```

Why this is good:

- avoids spelling mistakes
- consistent cache keys
- easier invalidation

---

## 34. Better folder structure for your project

Current:

```txt
src/component
src/utilitis/Api.js
```

Recommended:

```txt
src/
  api/
    axios.js
    postsApi.js
    usersApi.js
  components/
    Layout.jsx
    Header.jsx
    Footer.jsx
  features/
    posts/
      PostListManual.jsx
      PostListQuery.jsx
      PostDetails.jsx
      postQueries.js
    users/
      InfiniteUsers.jsx
      userQueries.js
  lib/
    queryClient.js
    queryKeys.js
  routes/
    router.jsx
  main.jsx or index.js
```

For beginner, you do not need to change everything immediately.

First do this:

```txt
src/api/Api.js
src/lib/queryClient.js
src/lib/queryKeys.js
```

---

## 35. Create `src/lib/queryClient.js`

```js
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

Then in `index.js`:

```js
import { queryClient } from './lib/queryClient'
```

Remove:

```js
const queryClient = new QueryClient()
```

---

## 36. Create `src/lib/queryKeys.js`

```js
export const queryKeys = {
  posts: {
    all: ['posts'],
    list: (page) => ['posts', 'list', page],
    detail: (id) => ['posts', 'detail', id],
  },
  users: {
    infinite: ['users', 'infinite'],
  },
}
```

Use in components:

```js
queryKey: queryKeys.posts.list(count)
```

---

## 37. Custom hooks pattern

Instead of writing `useQuery` directly in every component, production projects often create custom hooks.

Example:

```js
// src/features/posts/postQueries.js
import { useQuery } from '@tanstack/react-query'
import { postHandler, getSinglePostHandler } from '../../api/Api'
import { queryKeys } from '../../lib/queryKeys'

export function usePosts(start) {
  return useQuery({
    queryKey: queryKeys.posts.list(start),
    queryFn: () => postHandler(start),
  })
}

export function usePostDetails(id) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => getSinglePostHandler(id),
    enabled: Boolean(id),
  })
}
```

Component becomes clean:

```js
const { data, isLoading, error } = usePosts(count)
```

Why good?

- component focuses on UI
- API logic stays outside
- query keys stay consistent
- easier testing

---

## 38. Optimistic update beginner explanation

Optimistic update means:

```txt
Update UI immediately before server confirms.
If server fails, rollback old data.
```

Use case:

- like button
- delete item
- update title
- checkbox complete

Example optimistic delete:

```js
const deleteMutation = useMutation({
  mutationFn: deleteMethod,

  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['posts', count] })

    const previousPosts = queryClient.getQueryData(['posts', count])

    queryClient.setQueryData(['posts', count], (oldData = []) => {
      return oldData.filter((post) => post.id !== id)
    })

    return { previousPosts }
  },

  onError: (error, id, context) => {
    queryClient.setQueryData(['posts', count], context.previousPosts)
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
})
```

Flow:

```txt
1. User clicks delete
2. Cancel existing posts refetch
3. Save old cache snapshot
4. Remove item from UI immediately
5. If API fails, restore old cache
6. Refetch final data from backend
```

---

## 39. Error handling in production

Create common error helper:

```js
export function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Something went wrong'
}
```

Use:

```js
if (isError) {
  return <h1>{getErrorMessage(error)}</h1>
}
```

For mutation:

```js
onError: (error) => {
  alert(getErrorMessage(error))
}
```

---

## 40. What you should fix in your repo now

### Fix 1: Rename typo folder

Current:

```txt
src/utilitis/Api.js
```

Better:

```txt
src/api/Api.js
```

### Fix 2: Do not swallow errors

Remove try/catch from API functions unless you rethrow.

Bad:

```js
catch (err) {
  console.log(err)
}
```

Good:

```js
catch (err) {
  console.log(err)
  throw err
}
```

Best for this project:

```js
const response = await api.get('/posts')
return response.data
```

### Fix 3: Use `setQueryData` for one exact cache

Bad:

```js
queryClient.setQueriesData(['posts', count], updater)
```

Good:

```js
queryClient.setQueryData(['posts', count], updater)
```

### Fix 4: Add keys in lists

Bad:

```jsx
{data.map((item) => <div>...</div>)}
```

Good:

```jsx
{data.map((item) => <div key={item.id}>...</div>)}
```

### Fix 5: Infinite query should include `initialPageParam`

```js
useInfiniteQuery({
  queryKey: ['users'],
  queryFn: fetchUserHandler,
  initialPageParam: 1,
  getNextPageParam: ...
})
```

### Fix 6: Remove unused imports

In `index.js`, `App` and `Abc` are imported but not used.

Remove:

```js
import App from './App'
import Abc from './component/Abc'
```

### Fix 7: Devtools closed by default

```jsx
<ReactQueryDevtools initialIsOpen={false} />
```

---

## 41. Learning path for you

### Day 1: Understand server state

Learn:

- why useEffect is not enough
- queryKey
- queryFn
- isLoading/error/data

Practice:

- compare `/post` and `/post-rq`

### Day 2: Cache behavior

Learn:

- staleTime
- gcTime
- refetchOnWindowFocus
- retry

Practice:

- open Devtools
- navigate between pages
- change staleTime

### Day 3: Pagination

Learn:

- queryKey with page number
- placeholderData
- keepPreviousData

Practice:

- convert count to page
- prefetch next page

### Day 4: Mutation

Learn:

- useMutation
- mutate
- onSuccess
- onError
- invalidateQueries

Practice:

- delete post and refetch
- edit post and refetch

### Day 5: Manual cache update

Learn:

- setQueryData
- getQueryData
- setQueriesData

Practice:

- delete from cache without refetch
- edit cache without refetch

### Day 6: Infinite query

Learn:

- useInfiniteQuery
- initialPageParam
- getNextPageParam
- fetchNextPage
- hasNextPage

Practice:

- improve `/user` page

### Day 7: Production structure

Learn:

- api folder
- queryKeys file
- custom hooks
- queryClient config

Practice:

- refactor your project

### Day 8: Optimistic update

Learn:

- onMutate
- cancelQueries
- rollback
- onSettled

Practice:

- optimistic delete

### Day 9: Forms + mutation

Learn:

- create post
- update post
- validation
- mutation pending state

Practice:

- create post form

### Day 10: Advanced

Learn:

- prefetchQuery
- dependent queries
- select
- error boundaries
- suspense basics

Practice:

- prefetch post details on hover

---

## 42. Direct task list for your repo

Do in this order:

1. Fix `Api.js` error handling.
2. Add `src/lib/queryClient.js`.
3. Add `src/lib/queryKeys.js`.
4. Replace raw query keys with queryKeys helper.
5. Fix `PostRq.jsx` delete and edit mutation.
6. Fix `User.jsx` infinite query.
7. Add proper loading/error UI.
8. Add create post form with `useMutation`.
9. Add optimistic delete.
10. Add prefetch next page.

---

## 43. Final beginner summary

TanStack Query is used when data comes from server.

Use this rule:

```txt
GET data      -> useQuery
POST data     -> useMutation
PUT/PATCH     -> useMutation
DELETE        -> useMutation
Pagination    -> useQuery with page in queryKey
Infinite list -> useInfiniteQuery
```

Most important concepts:

```txt
queryKey      -> cache address
queryFn       -> API function
staleTime     -> how long data is fresh
gcTime        -> how long unused cache stays
invalidate    -> refetch because data changed
setQueryData  -> manually update cache
mutation      -> create/update/delete
```

Once you master this project, you can directly use TanStack Query in your Next.js HR/AI dashboard project for:

- employees list
- leave requests
- finance requests
- chat sessions
- audit logs
- admin dashboard stats
- pagination
- filters
- search
- mutation after approval/rejection

