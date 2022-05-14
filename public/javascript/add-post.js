async function newFormHandler(event) {
    event.preventDefault();

    // on form submission grab the post-title & post-url
    const title = document.querySelector('input[name="post-title"]').value;
    const post_url = document.querySelector('input[name="post-url"]').value;
  
    // and send them wiath a POST request to api/posts
    const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        post_url
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
};
  
  document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);