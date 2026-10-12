#include <SocketWrapper/Server.h>
#include <vector>

struct ClientInfo {
    std::unique_ptr<Socket> client;
    std::string ip;
};

void Server::run(int port) {
    WsaInitializer wsa;
    ServerSocket server(port);
    std::cout << "Server started at port: " << port << std::endl;
    std::vector<ClientInfo> clients;
    while(true) {
        fd_set readSet;
        FD_ZERO(&readSet);
        FD_SET(server.getHandle(), &readSet);
        SOCKET maxFd = server.getHandle();

        for (const auto& client: clients){
            FD_SET(client.client->getHandle(), &readSet);
            if (client.client->getHandle() > maxFd)
                maxFd = client.client->getHandle();
        }
        timeval timeout;
        timeout.tv_sec = 1;
        timeout.tv_usec = 0;
        int activity = select(0, &readSet, nullptr, nullptr, &timeout);
        if (activity < 0) throw NetworkException("select failed");
        if (FD_ISSET(server.getHandle(), &readSet)) {
            auto client = server.accept();
            std::string ip = client->getPeerIp();
            clients.push_back({std::move(client), ip});
        }
        for (size_t i = 0; i < clients.size();) {
            if (FD_ISSET(clients[i].client->getHandle(), &readSet)) 
            try {
                std::string message = clients[i].client->receive(2048);
                std::string broadcastMsg = "[" + clients[i].ip + "]: " + message + '\n';
                for (const auto& client : clients)
                    client.client->send(broadcastMsg);
            } catch (const std::exception& e) {
                std::cerr << "Disconnected: " << clients[i].ip << std::endl;
                clients.erase(clients.begin() + i);
                continue;
            }
            ++i;
        }
    }

}