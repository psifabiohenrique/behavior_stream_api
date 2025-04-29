import 'dart:convert';
import 'package:http/http.dart' as http;


class ApiService {
  static const String baseUrl = 'http://localhost/api';

  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/token/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return {
        'success': true,
        'token': data['token'],
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