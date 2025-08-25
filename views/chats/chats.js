// constants
const searchModel   = document.getElementById('search-modal')
const overlay       = document.getElementById('overlay')
const sidebarSearchInput = document.getElementById('sidebar-search-input')

// toggle search bar
document.getElementById('search-icon').addEventListener('click', ()=> {
    // if exists in the classes remove else add
    searchModel.classList.toggle('search-modal-collapsed')
    overlay.classList.toggle('hidden')
})

// click on overlay close the model
overlay.addEventListener('click', (event) => {
    if(!searchModel.classList.contains('search-modal-collapsed') && event.target != searchModel) {
        searchModel.classList.toggle('search-modal-collapsed')
        overlay.classList.toggle('hidden')
    }
})

// search modal
sidebarSearchInput.addEventListener('input', () => {
    if(sidebarSearchInput.value.length > 0) {
        document.getElementById('pre-search').classList.add('hidden')
        document.getElementById('post-search').classList.remove('hidden')

    }

    else {
        document.getElementById('post-search').classList.add('hidden')
        document.getElementById('pre-search').classList.remove('hidden')
    }

})

// search modal x-button
document.querySelector('#sidebar-search svg').addEventListener('click', () => {
    sidebarSearchInput.value = ''

    document.getElementById('post-search').classList.add('hidden')
    document.getElementById('pre-search').classList.remove('hidden')
})

const speed = 25; // pixels per second
const containers = document.querySelectorAll('.song-name-wrapper');

containers.forEach(container => {
  const text = container.querySelector('span');
  
  if(container.offsetWidth > text.offsetWidth){

    container.style.width = text.offsetWidth + 'px'
    container.style.height = text.offsetHeight + 'px'
    container.style.display = 'flex'
    container.style.justifyContent = 'center'
    container.style.alignItems = 'center'

    container.classList.remove('song-name-wrapper')

    text.style.position = 'relative'
    return;
  }

  let pos = container.offsetWidth; // container's right side
  const textWidth = text.offsetWidth;

  function step() {
    pos -= speed / 60; // 60 fps approximation
    
    // if fully overflows - position gets initialized back to the right side of the container
    if (pos <= -textWidth) {
      pos = container.offsetWidth;
    }

    // actually move it
    text.style.transform = `translateX(${pos}px) translateY(-50%)`;
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
});

// right notes scroll button
document.getElementById('scroll-notes-right').addEventListener('click', () => {
    const _2ndWrapper = document.getElementById('notes-2nd-wrapper')

    _2ndWrapper.scrollBy({
        left: 240,
        behavior: "smooth",
    })

    document.getElementById('scroll-notes-left').classList.remove('hidden')

    // if the button is in the end - hide it
    setTimeout(() => {
        if(_2ndWrapper.scrollLeft + _2ndWrapper.clientWidth >= _2ndWrapper.scrollWidth - 1) // to reduce error rate
        document.getElementById('scroll-notes-right').classList.add('hidden')
    }, 300)
})

// left notes scroll button
document.getElementById('scroll-notes-left').addEventListener('click', () => {
    const _2ndWrapper = document.getElementById('notes-2nd-wrapper')

    _2ndWrapper.scrollBy({
        left: -240,
        behavior: "smooth",
    })

    document.getElementById('scroll-notes-right').classList.remove('hidden')

    // if the button is in the start - hide it
    setTimeout(() => {
        if(_2ndWrapper.scrollLeft === 0)
        document.getElementById('scroll-notes-left').classList.add('hidden')
    }, 300)
})


// chats
document.querySelectorAll('.chat').forEach((chat) => {
    chat.addEventListener('click', () => {
        chat.classList.add('active')

        document.querySelectorAll('.chat.active').forEach((otherChat) => {
            if(otherChat !== chat)
            otherChat.classList.remove('active')
        })

        renderChat(chat)
        
    })
})

function renderChat(chat) {

}

document.getElementById('open-chat-message-input').addEventListener('input', ()=>{
    if(document.getElementById('open-chat-message-input').value.length > 0) {
        document.getElementById('open-chat-message-right-icons').classList.add('hidden')
        document.querySelector('#open-chat-message-box span').classList.remove('hidden')
    }

    else {
        document.getElementById('open-chat-message-right-icons').classList.remove('hidden')
        document.querySelector('#open-chat-message-box span').classList.add('hidden')
    }

    // resizing the textarea with a limit of 100px
    document.getElementById('open-chat-message-input').style.height = '50px'
    document.getElementById('open-chat-message-input').style.height = 
        Math.min(document.getElementById('open-chat-message-input').scrollHeight, 100) + 'px'

})