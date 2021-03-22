This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## **Installation and running this solution (ensure Docker is installed on your machine):** 

Run the following commands in your terminal:

1) git clone https://github.com/licarijd/the-rush

2) docker build -t licarijd/the-rush the-rush

3) docker run -p 8081:8081 -d licarijd/the-rush


## **Design Decisions**

**Non-functional requirements:** Minimal latency, front end data should not go stale

**Server-Side Caching:**
In a large scale application, the rush records would likely be coming from some dependency. To prevent overwhelming such a dependency, I cache the response for a one minute server-side, which is short enough that cache expiry is still easy to test. 

**Client-Side Caching and Pagination:**
The API only returns one page at a time, to prevent extrmely large responses in the case that the number of records increases. Every time a new page is requested, the client checks if the server cache key has changed. A new cache key indicates that the server has fetched new rush records from the NFL Rush Records data source. So if the cache key changes, the Redux store will be cleared. If the cache key hasn't changed, pages which exist in the Redux store will be used instead of fetching new data. And since the cache key is 
checked every time a request for a new page is made, data won't go stale.

**Why did I use NexJS?**
I know that I'll be adding features to this project; if one of those features involves a new route, NextJS will be a life saver!

**Why did I build an isomorphic web app?**
Given the simplicity of the application, I decided to make the server render the front end; thus getting the benefits of both a single page application and server side rendering. That being said, I did not make use of shared (server and client) data and functions. Every constant and function either belongs exclusively to the server, or exclusively to the client. So if it is ever desirable to split the server and the React front end into different projects, it wouldn't be too much of a headache!
