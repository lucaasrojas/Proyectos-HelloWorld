const spotifyService = {
    baseUrl: 'https://platzi-music-api.now.sh'

}

spotifyService.search = function (query, type){

    const url = `${this.baseUrl}/search?q=${query}&type=${type}`

    return fetch(url, { method: 'GET' })
    .then(res => {
      // En el caso de que hay un error disparamos una excepción
      // para luego manejarla en nuestro componente
      if (res.status !== 200) {
        throw res.statusText
      }

      // Casteamos la respuesta y la devolvemos para
      // usarla luego en el componente
      return res.json()
    })

}

export default spotifyService