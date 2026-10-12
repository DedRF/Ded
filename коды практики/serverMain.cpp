#include <SocketWrapper/Server.h>

int main() {
    Server server;
    try {
        server.run(8080);
    } catch(const std::exception &e) {
        std::cout << "[Server] Error: " << e.what() << std::endl;
    }
    return 0;
}