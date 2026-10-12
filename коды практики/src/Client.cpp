#include <SocketWrapper/Client.h>

ClientSocket::ClientSocket(int port) : Socket(socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)) {
    if (!isValid()) throw NetworkException("invalid client socket");
    sockaddr_in clientAddress;
    clientAddress.sin_family = AF_INET;
    clientAddress.sin_port = htons(port);
    clientAddress.sin_addr.s_addr = INADDR_ANY;
    if (::bind(socket_, reinterpret_cast<sockaddr*>(&clientAddress), sizeof(clientAddress)) == SOCKET_ERROR)
        throw NetworkException("bind failed");
}

void ClientSocket::connect(const std::string &host, int port) {
    if (!isValid()) throw NetworkException("invalid client socket");
    sockaddr_in serverAddress;
    serverAddress.sin_family = AF_INET;
    serverAddress.sin_port = htons(port);
    if (inet_pton(AF_INET, host.c_str(), &serverAddress.sin_addr) != 1)
        throw NetworkException("invalid ip host");
    if (
        ::connect(
            socket_, 
            reinterpret_cast<sockaddr*>(&serverAddress), 
            sizeof(serverAddress)) == SOCKET_ERROR
        )
        throw NetworkException("connect failed");
}


