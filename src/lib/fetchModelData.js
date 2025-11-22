/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 * @returns {Promise} A promise that resolves with the model data or rejects with an error.
 */
function fetchModel(url) {
  // Thêm base URL của backend nếu url là relative path
  const baseURL = "https://ctp8m4-8081.csb.app";
  const fullURL = url.startsWith("http") ? url : baseURL + url;
  
  return new Promise((resolve, reject) => {
    fetch(fullURL)
      .then((response) => {
        if (!response.ok) {
          reject(new Error(`HTTP error! status: ${response.status}`));
          return;
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default fetchModel;
