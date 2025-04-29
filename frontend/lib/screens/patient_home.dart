// patient_home.dart
import 'package:flutter/material.dart';

class PatientHome extends StatelessWidget {
  const PatientHome({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Área do Paciente')),
      body: const Center(child: Text('Bem-vindo, paciente!')),
    );
  }
}
