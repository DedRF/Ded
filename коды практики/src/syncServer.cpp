#include <SocketWrapper/Server.h>

void Server::run(int port) {
    WsaInitializer wsa;
    ServerSocket server(port);
    std::cout << "Server started at port: " << port << std::endl;
    while(true) {
        auto client = server.accept();
        std::cout << "[Server] Client connected!" << std::endl;
        try {
            while(true) {
                std::string message = client->receive(2048); 
                if (message.empty()) break;
                std::cout << "[Server] Message: " << message << std::endl;
                std::string response;
                std::getline(std::cin, response);
                client->send(response);
            }
        } catch(const std::exception& e) {
            std::cout << "[Server] Error: " << e.what() << std::endl;
        }
        std::cout << "[Server] Client disconnected" << std::endl;
    }
}