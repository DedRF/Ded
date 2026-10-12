#include <Server.h>

ServerSocket::ServerSocket(int port, bool isLocalHostOnly = false)
    : Socket(socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)) {}