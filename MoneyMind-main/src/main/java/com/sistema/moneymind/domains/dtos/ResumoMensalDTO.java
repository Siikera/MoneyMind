package com.sistema.moneymind.domains.dtos; // Ou um pacote de sua preferência

public class ResumoMensalDTO {

    private double totalEntradas; // Soma de todos os DÉBITOS (positivo)
    private double totalSaidas;   // Soma de todos os CRÉDITOS (negativo)
    private double resultadoFinal;  // Entradas + Saídas

    // Construtor, Getters e Setters

    public ResumoMensalDTO() {
    }

    public ResumoMensalDTO(double totalEntradas, double totalSaidas, double resultadoFinal) {
        this.totalEntradas = totalEntradas;
        this.totalSaidas = totalSaidas;
        this.resultadoFinal = resultadoFinal;
    }

    public double getTotalEntradas() {
        return totalEntradas;
    }

    public void setTotalEntradas(double totalEntradas) {
        this.totalEntradas = totalEntradas;
    }

    public double getTotalSaidas() {
        return totalSaidas;
    }

    public void setTotalSaidas(double totalSaidas) {
        this.totalSaidas = totalSaidas;
    }

    public double getResultadoFinal() {
        return resultadoFinal;
    }

    public void setResultadoFinal(double resultadoFinal) {
        this.resultadoFinal = resultadoFinal;
    }
}
