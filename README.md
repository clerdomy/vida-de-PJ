# Calculadora CLT para PJ

Uma calculadora web interativa para comparar salários entre regimes CLT e PJ, incluindo benefícios, impostos e custos do empregador. Desenvolvida com HTML, JavaScript e Tailwind CSS.

## 🚀 Funcionalidades

- **Cálculos Precisos**
  - INSS e IR com tabelas atualizadas para 2025
  - Benefícios tributáveis e não tributáveis
  - FGTS, férias e 13º salário
  - Custo total para o empregador

- **Benefícios**
  - Gerenciamento completo de benefícios
  - Distinção entre benefícios tributáveis e não tributáveis
  - Interface intuitiva para adicionar/remover benefícios

- **Regimes Tributários PJ**
  - Simples Nacional (alíquota padrão: 6%)
  - Lucro Presumido (alíquota padrão: 13.33%)
  - Alíquotas personalizáveis

- **Interface Responsiva**
  - Design moderno e adaptativo
  - Animações suaves
  - Feedback visual em tempo real
  - Tooltips informativos

## 💻 Tecnologias

- HTML5
- JavaScript (ES6+)
- Tailwind CSS
- Lucide Icons

## 📊 Detalhes dos Cálculos

### Faixas INSS 2025
| Faixa Salarial | Alíquota |
|----------------|----------|
| Até R$ 1.518,00 | 7,5% |
| R$ 1.518,01 até R$ 2.793,88 | 9% |
| R$ 2.793,89 até R$ 4.190,83 | 12% |
| R$ 4.190,84 até R$ 8.157,41 | 14% |

### Faixas IR 2025
| Base de Cálculo | Alíquota | Dedução |
|-----------------|----------|----------|
| Até R$ 2.259,20 | 0% | R$ 0,00 |
| R$ 2.259,21 a R$ 2.824,00* | 0% | R$ 564,80 |
| R$ 2.259,21 a R$ 2.828,65 | 7,5% | R$ 169,44 |
| R$ 2.828,66 até R$ 3.751,05 | 15% | R$ 381,44 |
| R$ 3.751,06 até R$ 4.664,68 | 22,5% | R$ 662,77 |
| Acima de R$ 4.664,68 | 27,5% | R$ 896,00 |

\* Desconto especial aplicável quando vantajoso

### Encargos do Empregador
- INSS Patronal: 20%
- RAT/SAT: ~2%
- Sistema S: ~5.8%
- FGTS: 8%
- Provisões: 13º e Férias

## 🚀 Como Usar

1. Abra o arquivo `index.html` em um navegador moderno
2. Preencha o salário CLT bruto
3. Adicione benefícios se necessário
4. Selecione o regime tributário PJ
5. Ajuste a alíquota se necessário
6. Clique em "Calcular Valores"

## 📝 Notas Importantes

- Os valores são calculados mensalmente
- Benefícios tributáveis afetam a base de cálculo do INSS e IR
- O cálculo PJ considera um adicional de 30% sobre o salário CLT
- O teto do INSS para 2025 é R$ 8.157,41
- Valores de dependentes para IR: R$ 189,59 por dependente

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor, sinta-se à vontade para submeter pull requests.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Agradecimentos

- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
- [Lucide Icons](https://lucide.dev/) pelos ícones
