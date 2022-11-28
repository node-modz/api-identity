
// TODO: figure out why i get hydration error on refresh of /posts page
const Posts = () => {
  // const [{ data, fetching }] = usePostsQuery();
  return (<>
    <>Hello Posts</>
    <br />
    {/* {!data
      ? <>Loading .. </>
      : data.posts.map(post => <div key={post.id}>{post.title}</div>)
    } */}
  </>
  );
}

export default Posts;