#include <SocketWrapper.h>
#include <memory>

class ServerSocket : public Socket {
public:
    ServerSocket(int port, bool isLocalHostOnly = false);
    std::unique_ptr<Socket> accept();
};

class Server final {
public:
    void run(int port);
};