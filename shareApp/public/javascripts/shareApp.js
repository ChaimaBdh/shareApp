const socket = io();

const availableDiv = document.getElementById('available');
const inventorySpan = document.getElementById("inventory");
const contentDiv = document.getElementById('content');
const othersBorrower = document.getElementById('others-item');
const createBtn = document.getElementById('create');

const userDiv = document.getElementById('userId');
const log = document.getElementById('logout');

const displayItems = async () => {
    const options = {
      method: 'GET'
    };
    const response = await fetch('/item/', options);
    if (!response.ok) {
      throw new Error('Response not ok');
    }
    const items = await response.json();
    let html = '<ul>';
    items.forEach(item => {
          html += `<li class="item">${item.description} <button class="borrow" data-id="${item._id}">Emprunter</button> <button class="update" data-id="${item._id}">Modifier</button> <button class="delete" data-id="${item._id}">Supprimer</button></li>`;    });
    availableDiv.innerHTML = html;

    const deleteBtn = document.querySelectorAll('.delete');
    deleteBtn.forEach(deleteButton => {
      deleteButton.addEventListener('click', () => {
        const itemId = deleteButton.getAttribute('data-id');
        deleteItem(itemId, deleteButton);
      });
    });
    const borrowBtn = document.querySelectorAll('.borrow');
    borrowBtn.forEach(button => {
      button.addEventListener('click', () => {
        const itemId = button.getAttribute('data-id');
        borrowItem(itemId, button);
      });
    });
    const updateBtn = document.querySelectorAll('.update');
    updateBtn.forEach(button => {
      button.addEventListener('click', () => {
        const itemId = button.getAttribute('data-id');
        updateItem(itemId, button);
      });
    });
};

const deleteItem = async (itemId, button) => {
  const options = {
    method: 'DELETE'
  };
  const response = await fetch(`/item/${itemId}`, options);
  if (response.ok) {
    contentDiv.textContent = `Item with id ${itemId} was deleted.`;
    button.parentNode.remove();
    socket.emit('deleted', itemId);
  } else if (response.status === 403) {
    contentDiv.textContent = `Cannot delete an item you didn't add !`;
  } else {
    contentDiv.textContent = `Item with id ${itemId} cannot be deleted !`;
  }
  displayItems();
};

const borrowItem = async (itemId, button) => {
  const options = {
    method: 'PUT'
  };
  const response = await fetch(`/item/borrow/${itemId}`, options);
  if (response.status === 400) {
    contentDiv.textContent = `You cannot borrow more than 2 objects.`;
    const error = await response.json();
    throw new Error(error.error);
  }
  const item = await response.json();
  const listItem = document.createElement('li');
  contentDiv.textContent = `Item with id ${itemId} is borrowed.`;
  listItem.innerHTML = `${item.description}<button class="release" data-id="${item._id}">Rendre</button>`;
  inventorySpan.appendChild(listItem);
  const releaseButton = listItem.querySelector('.release');
  releaseButton.addEventListener('click', async () => {
    await releaseItem(itemId, releaseButton);
    listItem.remove();
  });
  button.parentNode.remove();
  displayItems();
  socket.emit('borrowed',itemId);
};


const releaseItem = async (itemId, button) => {
  const options = {
    method: 'PUT'
  };
  const response = await fetch(`/item/release/${itemId}`, options);
  if (!response.ok) {
    throw new Error(`Failed to release item with id ${itemId}.`);
  }
  const item = await response.json();
  contentDiv.textContent = `Item with id ${itemId} is released .`;
  displayItems();
  socket.emit('released',itemId);
};

const othersItems = async () => {
  const options = {
    method: 'GET',
  };
  const response = await fetch('/item/others', options);
  console.log(response);
  const items = await response.json();
  console.log(items);
  items.forEach(item => {
    othersBorrower.innerHTML += `<li class="elts"><td class="desc">${item.description} (by ${item.userName})</td></li>`;
  });
  displayItems();

  socket.on('borrowed', () => {
    displayothersItems();
  });

  socket.on('released', () => {
    displayothersItems();
  });

  socket.on('created', () => {
    displayothersItems();
  });
};

const displayothersItems = async () => {
  othersBorrower.innerHTML = '';
  const options = {
    method: 'GET',
  };
  const response = await fetch('/item/others', options);
  console.log(response);
  const items = await response.json();
  console.log(items);
  items.forEach(item => {
    othersBorrower.innerHTML += `<li class="elts"><td class="desc">${item.description} (by ${item.userName})</td></li>`;
  });
};

const createItem = async () => {
    const description = document.getElementById('desc').value;
    if (!description) {
      contentDiv.textContent = 'item description cannot be empty.';
      return;
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({description})
    };
    const response = await fetch('/item/', options);
    if (!response.ok) {
      throw new Error('Response not ok');
    }
    const createdItem = await response.json();
    contentDiv.textContent = `item with id ${createdItem._id} was created.`;
    displayItems();
    socket.emit('created',createdItem);
};

const updateItem = async (itemId, button) => {
  const newDescription = prompt('Entrez un nouveau nom pour cet objet :');
  if (!newDescription) {
    contentDiv.textContent = 'Description cannot be empty !';
    return;
  }
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ itemId, newDescription })
  };
  const response = await fetch(`/item/update/${itemId}`, options);
  if (!response.ok) {
    const error = await response.json();
    contentDiv.textContent = error.message;
    return;
  }
  const updatedItem = await response.json();
  contentDiv.textContent = `Item with id ${updatedItem._id} was updated.`;
  displayItems();
  socket.emit('updated', updatedItem);
};

const getUser = async () => {
  const options = {
    method: 'GET',
  };
  const response = await fetch('/user/me', options);
  console.log(response);
  if (response.ok) {
    const user = await response.json();
    userDiv.textContent = `${user.name} id is ${user.id}` || '';
  } else {
    const error = await response.json();
    handleError(error);
  }
}

const logout = async () => {
  const options = {
                         method :'GET',
                       };
  const response = await fetch(`/access/logout`, options);
  if (response.ok) {
    window.location.href= '/';
  }
};

socket.on('created', (itemId) => {
  displayItems();
});

socket.on('deleted', (itemId) => {
  displayItems();
});

socket.on('borrowed', (itemId) => {
  displayItems();
});

socket.on('released', (itemId) => {
  displayItems();
});

socket.on('updated', (itemId) => {
  displayItems();
});


const setup = () => {
  createBtn.addEventListener('click', createItem);
  log.addEventListener('click', logout);
  getUser();
  displayItems();
  othersItems();
}

window.addEventListener('DOMContentLoaded', setup);
