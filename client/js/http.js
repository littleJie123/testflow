class Http{
  static async post(url,params){
    let ret = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    return ret.json()
  }
}