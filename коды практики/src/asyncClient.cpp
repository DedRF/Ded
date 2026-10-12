#include <SocketWrapper/Client.h>
#include <iostream>
#include <string>
#include <vector> 
#include <thread> 
#include <mutex> 
void Client::run(const std::string& host, int serverPort, int clientPort){
    
    ClientSocket client(clientPort);
    try{
        client.connect(host, serverPort); 
        std::cout << "Connected to server: " << host << ":" << serverPort << std::endl; 

    } catch(const std::exception &e){
        std::cerr << "Connection failed: " << e.what() << std::endl;
        return;
    }
    std::vector<std::string> messageBuffer;
    std::mutex bufferMutex; 
    std::thread receiver([&client, &messageBuffer, &bufferMutex](){
        try { 
            while(true){
            std::string message = client.receive(2048);
            std::lock_guard<std::mutex> lc(bufferMutex);
            messageBuffer.push_back(message);
        }
    } catch(const NetworkException &e){
        std::cerr << "\nDisconnected from server: " << e.what() << std::endl;
    
    } catch(const std::exception &e){
        std::cerr << "\nReceiver error: " << e.what() << std::endl;
    }
    });
    std::string message;
    std::cout << "Enter your message: ";
    while(std::getline(std::cin, message)){
        try {
            client.send(message);
        std::lock_guard<std::mutex> lc(bufferMutex);
        if (!messageBuffer.empty()){
            std::cout << "Income message: " << std::endl; 
            for (const auto &msg : messageBuffer)
            std::cout << msg << "\n";
            messageBuffer.clear(); 
        }
    } catch(const std::exception &e){
        std::cerr << "Send error: " << e.what() << std::endl; 
        break; 
        }
    }
    client.close();
    receiver.join();
    
}