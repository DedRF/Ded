#include <SocketWrapper.h>

class ClientSocket : public Socket {
public:
    ClientSocket();
    void connect(const std::string& host, int port);
};

class Client final {
public:
    void run(const std::string& host, int port);
};