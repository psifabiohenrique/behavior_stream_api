// psychologist_home.dart
import 'package:flutter/material.dart';

class PsychologistHome extends StatelessWidget {
  const PsychologistHome({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Área do Psicólogo')),
      body: const Center(child: Text('Bem-vindo, psicólogo!')),
    );
  }
}
