class SocketController {
  #io;

  constructor(io) {
    this.#io = io;
  }

  registerSocket(socket) {
    console.log(`socket ${socket.id} connected`);
    socket.on('disconnect', () => {
      console.log(`socket ${socket.id} disconnected`);
    });
    socket.on('created', (id) => this.emitCreatedItem(socket, id));
    socket.on('deleted', (id) => this.emitDeletedItem(socket, id));
    socket.on('borrowed', (id) => this.emitBorrowedItem(socket, id));
    socket.on('released', (id) => this.emitReleasedItem(socket, id));
    socket.on('updated', (id) => this.emitUpdatedItem(socket, id));
  }

  emitCreatedItem(socket, id) {
    this.#io.emit('created', id);
  }

  emitDeletedItem(socket, id) {
    this.#io.emit('deleted', id);
  }

  emitBorrowedItem(socket, id) {
    this.#io.emit('borrowed', id);
  }

  emitReleasedItem(socket, id) {
    this.#io.emit('released', id);
  }

  emitUpdatedItem(socket, id) {
    this.#io.emit('updated', id);
  }
}

module.exports = SocketController;
