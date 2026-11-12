#define ASIO_STANDALONE
#ifdef _WIN32
#define _WIN32_WINNT 0x0A00
#endif
#include <asio.hpp>
#include <asio/ts/internet.hpp>
#include <asio/ts/buffer.hpp>
#include <iostream>
#include <chrono>

std::vector<char> vBuffer(20 * 1024);
void grab_some_data(asio::ip::tcp::socket& socket){
	socket.async_read_some(
		asio::buffer(
			vBuffer.data(),
			vBuffer.size()
		),
		[&](std::error_code ec, size_t lenght) {
			if (!ec) {
				std::wcout << "\n\nRead:" << length << "bytec\n\n";
				for (int i = 0; i < lenght; ++i)
					std::cout << vBuffer[i];
				grab_some_data(socket);
			}
		}

int main() {
	asio::error_code ec;
	asio::io_context context;
	asio::ip::tcp::endpoint endpoint(
		asio::ip::make_address("51.38.81.49", ec), 80
	);
	asio::ip::tcp::socket socket(context);
	socket.connect(endpoint, ec);
	if (!ec) std::cout << "connected!" << std::endl;
	else std::cerr << "failed to connect: " << ec.message() << std::endl;
	return 0;
};

soket.write_some(asio::buffer(
	recuest.data(),
	recuest.size()
), ec);

socket.mait(socket.wail_read);

size_t bytes = socket.avilable();
std::cout << "Bytes available: " << bytes << std::endl;
if (bytes > 0) {
	std::vector<char> vBuffer(bytes);
	socket.read_some(asio::buffer(
		vBuffer.data()
		vBuffer.size()
	), ec),
		for (auto c : vBuffer) std::cout << c;
	}
}
return 0;
}