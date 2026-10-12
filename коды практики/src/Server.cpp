#include <SocketWrapper/Server.h>

ServerSocket::ServerSocket(int port, bool isLocalHostOnly)
    : Socket(socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)) {
        if (!isValid()) throw NetworkException("invalid server socket");
        
        sockaddr_in serverAddress;
        serverAddress.sin_family = AF_INET;
        serverAddress.sin_port = htons(port);
        serverAddress.sin_addr.s_addr = isLocalHostOnly 
                                        ? htonl(INADDR_LOOPBACK) 
                                        : INADDR_ANY;

        if (::bind(socket_, reinterpret_cast<sockaddr*>(&serverAddress), sizeof(serverAddress)) == SOCKET_ERROR)
            throw NetworkException("bind failed");
        if (::listen(socket_, SOMAXCONN) == SOCKET_ERROR)
            throw NetworkException("listen failed");
    }

std::unique_ptr<Socket> ServerSocket::accept() {
    if (!isValid()) throw NetworkException("invalid server socket");           
    sockaddr_in clientAddress;
    int szClientAddress = sizeof(clientAddress);
    SOCKET clientSocket = ::accept(
                        socket_, 
                        reinterpret_cast<sockaddr*>(&clientAddress), 
                        &szClientAddress
                    );
    if (clientSocket == INVALID_SOCKET)
        throw NetworkException("accept failed");
    return std::make_unique<Socket>(clientSocket);
}


