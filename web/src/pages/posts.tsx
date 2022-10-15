import TopNavBar from "../components/TopNavBar"
import SimpleSidebar from "../components/Sidebar"
import { usePostsQuery } from '../graphql/identity/graphql'
import { createUrqlClient } from '../app/urql-bootstrap'
import { withUrqlClient } from 'next-urql'

// TODO: figure out why i get hydration error on refresh of /posts page
const Posts = () => {
  const [{ data, fetching }] = usePostsQuery();
  return (<>
    <TopNavBar />
    <SimpleSidebar>
      <>Hello Posts</>
      <br />
      {!data
        ? <>Loading .. </>
        : data.posts.map(post => <div key={post.id}>{post.title}</div>)
      }
    </SimpleSidebar>
  </>
  );
}

export default withUrqlClient(createUrqlClient,{ssr:true})(Posts)