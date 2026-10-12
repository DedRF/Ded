#include <SocketWrapper/SocketWrapper.h>

NetworkException::NetworkException(const std::string &message) 
    : std::runtime_error(message + "(Error: " + std::to_string(WSAGetLastError()) + ")") {}

WsaInitializer::WsaInitializer() {
    WSAData wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0)
        throw NetworkException("WSAStartup failed!");
}

WsaInitializer::~WsaInitializer() { WSACleanup(); }

Socket::Socket(SOCKET socket) : socket_(socket) {}

Socket::Socket(Socket &&other) noexcept : socket_(std::move(other.socket_)) {
    other.socket_ = INVALID_SOCKET;
}

Socket &Socket::operator=(Socket &&other) noexcept {
    if (this == &other) return *this;
    std::swap(socket_, other.socket_);
    return *this;
}

Socket::~Socket() { close(); }

bool Socket::isValid() const { return socket_ != INVALID_SOCKET; }

SOCKET Socket::getHandle() const { return socket_; }

std::string Socket::getPeerIp() const {
    sockaddr_in address;
    int szAddress = sizeof(address);
    if (::getpeername(socket_, reinterpret_cast<sockaddr*>(&address), &szAddress) != 0)
        return "unknown";
    char peerIP[INET_ADDRSTRLEN];
    inet_ntop(AF_INET, &address.sin_addr, peerIP, INET_ADDRSTRLEN);
    return std::string(peerIP); 
}

void Socket::close() {
    if (isValid()) {
        closesocket(socket_);
        socket_ = INVALID_SOCKET;
    }
}

void Socket::send(const std::string &message) {
    send(message.c_str(), message.length());
}

void Socket::send(const void *data, size_t sz) {
    if (!isValid()) throw NetworkException("Socket is not valid");
    const char* p = static_cast<const char*>(data);
    size_t totalSent = 0;
    while(totalSent < sz) {
        int sent = ::send(socket_, p + totalSent, static_cast<int>(sz - totalSent), 0);
        if (sent == SOCKET_ERROR) throw NetworkException("Send failed!");
        totalSent += sent;
    }
}

size_t Socket::receive(void *buffer, size_t sz) {
    if (!isValid()) throw NetworkException("Socket is not valid");
    int recieved = ::recv(socket_, static_cast<char*>(buffer), static_cast<int>(sz), 0);
    if (recieved == SOCKET_ERROR) throw NetworkException("Receive failed!");
    return recieved;
}

std::string Socket::receive(size_t sz) {
    std::string message(sz, '\0');
    size_t received = receive(&message[0], sz);
    message.resize(received);
    return message;
}
