class Todo {
  constructor() {
    this.url = "/api/todo/";
  }

  sender(url, options = null) {
    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("gagal mendapatkan data todo");
        }
        return response.json();
      })
      .then((response) => {
        return response;
      })
      .catch((error) => console.log(error));
  }

  get(id = null) {
    if (id) {
      return this.sender(this.url + id);
    }
    return this.sender(this.url);
  }

  add(data) {
    let query = new URLSearchParams();
    query.append("todo", data);
    let options = {
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: query,
    };
    return this.sender(this.url, options);
  }

  delete(id) {
    if (id) {
      return this.sender(this.url + id, { method: "delete" });
    }
  }
  update(id, teks) {
    let query = new URLSearchParams();
    query.append("todo", teks);
    let options = {
      method: "put",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: query,
    };
    return this.sender(this.url + id, options);
  }
}
