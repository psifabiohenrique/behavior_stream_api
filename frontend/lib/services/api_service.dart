import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // static const String baseUrl = 'http://localhost/api';

  static const String baseUrl = 'http://127.0.0.1:8000/api';

  static Future<Map<String, dynamic>> login(
    String email,
    String password,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/token/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );
      print(response.body);

      if (response.statusCode == 200) {
        final token = jsonDecode(response.body);

        final dataResponse = await http.get(
          Uri.parse('$baseUrl/users/me'),
          headers: {'Authorization': 'Bearer ${token['access']}'},
        );
        print(dataResponse.body);

        if (dataResponse.statusCode != 200) {
          return {
            'success': false,
            'message': 'Erro ao obter dados do usuário',
          };
        }

        final data = jsonDecode(dataResponse.body);

        return {
          'success': true,
          'token': token['access'],
          'role': data['role'],
        };
      } else {
        return {'success': false, 'message': 'Email ou senha inválidos'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Erro ao conectar com o servidor'};
    }
  }
}
