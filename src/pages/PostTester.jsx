import { useEffect, useState } from 'react';

export default function PostTester() {
  const [riderPosts, setRiderPosts] = useState([]);
  const [driverPosts, setDriverPosts] = useState([]);

  useEffect(() => {
    // Fetch rider posts
    fetch("http://localhost:3000/api/posts?is_rider_post=true", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setRiderPosts(data))
      .catch((err) => console.error("Rider fetch error:", err));

    // Fetch driver posts
    fetch("http://localhost:3000/api/posts?is_rider_post=false", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setDriverPosts(data))
      .catch((err) => console.error("Driver fetch error:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🚗 Post Tester</h1>

      <h2>Rider Posts</h2>
      <ul>
        {riderPosts.map((post) => (
          <li key={post.post_id}>
            {post.place_from} → {post.place_to} (seats needed: {post.seats_needed})
          </li>
        ))}
      </ul>

      <h2>Driver Posts</h2>
      <ul>
        {driverPosts.map((post) => (
          <li key={post.post_id}>
            {post.place_from} → {post.place_to} (seats: {post.available_seats})
          </li>
        ))}
      </ul>
    </div>
  );
}