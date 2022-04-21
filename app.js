const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNext = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`




const getMoreSongs = async url => {/// funcao para conseghuir 15 novos songs 
    try{
        const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`) 
        const data = await response.json()
        console.log(data)
        insertSongsIntoPage(data)
    }catch {
        console.log('deu errado ')
    }


}

const insertSongsIntoPage = songsInfo => {
    console.log(songsInfo)

    songsContainer.innerHTML = songsInfo.data.map(songs =>`
    <li class="song">
       <span class="song-artist"><strong>${songs.artist.name}</strong> - ${songs.title}</span>
       <button class="btn" data-artist="${songs.artist.name}" data-song-title="${songs.title}"> Ver Letras</button>
    </li>`
    ).join('')

    if(songsInfo.prev || songsInfo.next) {
        prevAndNext.innerHTML = `
            ${songsInfo.prev ? `<button class="btn" onClick="getMoreSongs('${songsInfo.prev}')">Anteriores</button>` : ''}
            ${songsInfo.next ? `<button class="btn" onClick="getMoreSongs('${songsInfo.next}')">Proximas</button>` : '' }
        `
        return
    }
    prevAndNext.innerHTML = ''
}

//fazendo a requisicao da API  usando async e await / igual o  fetch porem mia ssimples 
const fetchSogns = async terns  => {

    const response = await fetch(`${apiURL}/suggest/${terns}`)
    const data = await response.json()
    insertSongsIntoPage(data)
}

//funcao quando o formulario for enviado

form.addEventListener('submit' , event => {
    event.preventDefault()
    const searchTern = searchInput.value.trim()


    if(searchTern === ''){
       songsContainer.innerHTML = `<li class="warning-message"> Por Favor,Preencha o campo de busca.</li>`
       return 
    }

    fetchSogns(searchTern)

})

const fetchLyric = async (artist , songTile) => {
    const response = await fetch(`${apiURL}/v1/${artist}/${songTile}`)
    const data = await response.json()
    const lyric = data.lyrics.replace(/(\r\n|\n)/g, '<br>')
  
    songsContainer.innerHTML = `
    <li class="lyrics-container">
        <h2>
         <strong>${songTile}</strong> - ${artist}
        </h2>
        <p class="lyrics">${lyric}}</p>
    </li>
    `

}

songsContainer.addEventListener('click' , event => {
    const clickEvent = event.target

    if(clickEvent.tagName === 'BUTTON'){
        const artist = clickEvent.getAttribute('data-artist')
        const songTitle = clickEvent.getAttribute('data-song-title')
        fetchLyric(artist , songTitle)
        
        prevAndNext.innerHTML = ''
    }    
})
