#include <string>
#include <cstring>
#include <stdexcept>

#include <WinSock2.h>
#include <WS2tcpip.h>
#pragma comment(lib, "ws2_32.lib")

class NetworkException : public std::runtime_error {
public:
    explicit NetworkException(const std::string& message);
};

class WsaInitializer final {
public:
    WsaInitializer();
    ~WsaInitializer();
    WsaInitializer(const WsaInitializer&) = delete;
    WsaInitializer& operator=(const WsaInitializer&) = delete;
};

class Socket {
protected:
    SOCKET socket_;
public:
    explicit Socket(SOCKET socket);
    Socket(const Socket&) = delete;
    Socket& operator=(const Socket&) = delete;
    Socket(Socket&&) noexcept;
    Socket& operator=(Socket&&) noexcept;
    virtual ~Socket();
public:
    bool isValid() const;
    SOCKET getHandle() const;
    std::string getPeerIp() const;
    void close();
    void send(const std::string& message);
    void send(const void*, size_t);
    size_t receive(void* buffer, size_t);
    std::string receive(size_t);
};