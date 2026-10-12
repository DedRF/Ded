#include <SocketWrapper/SocketWrapper.h>
#include <iostream>

class ClientSocket : public Socket {
public:
    ClientSocket(int port);
    void connect(const std::string& host, int port);
};

class Client final {
public:
    void run(const std::string& host, int serverPort, int clientPort);
};