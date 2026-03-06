# DEMO REPORT - Ana Silva × Pesquisa e Filtro de Produto Técnico

## PERSONA
**Ana Silva** — Utilizadora tech-savvy com 12 anos de experiência em ecommerce

## TAREFA
**Pesquisa e Filtro de Produto Técnico**

Descrição da tarefa:
Simule um cenário de compra no qual você, como utilizadora tech-savvy, precisa de encontrar um smartphone de gama alta que atenda a critérios específicos: marca reconhecida (Samsung ou Apple), orçamento entre €800-1200, e especificações técnicas mínimas (RAM mínimo 12GB, armazenamento mínimo 256GB, taxa de refresh mínimo 120Hz). Inicie uma pesquisa na barra de pesquisa principal, navegue pelos resultados, aplique sequencialmente os filtros avançados de marca, preço e especificações técnicas, compare visualmente os produtos disponíveis e, finalmente, aceda à página de detalhes do smartphone escolhido. Durante todo o processo, avalie a clareza da interface, a intuitibilidade dos filtros, a organização das informações técnicas, a qualidade dos resultados apresentados e a facilidade de navegação entre categorias. Identifique pontos fortes na experiência de utilizador e também áreas de friction que dificultam a conclusão da tarefa.

Categoria: Catálogo · Objetivo: Pesquisar e filtrar produtos técnicos de forma intuitiva · 5 steps

---

## ESTRUTURA DO TESTE

**Conseguiu completar o objetivo?** Parcialmente
- O processo de pesquisa foi fluido e intuitivo, mas os filtros avançados de especificações técnicas não estavam claramente visíveis na primeira interação. Ana precisou descer duas vezes a página para encontrá-los.

**Tempo estimado:** 8 minutos

---

## ANÁLISE

### PONTO POSITIVO #1
- **Título:** Barra de pesquisa prominente e acessível
- **Descrição:** A barra de pesquisa está bem posicionada no topo da página, com ícone claro de lupa e campo amplo para entrada de texto. Ana encontrou-a imediatamente sem hesitação.
- **Zona da página:** Header / Barra de navegação superior
- **Impacto:** Reduz friction e facilita a entrada dos utilizadores no fluxo de pesquisa

### PONTO POSITIVO #2
- **Título:** Autocomplete com sugestões relevantes
- **Descrição:** Ao digitar "Samsung Galaxy S25", o sistema ofereceu sugestões inteligentes e relevantes. Ana não precisou de escrever o nome completo do produto.
- **Zona da página:** Dropdown de pesquisa
- **Impacto:** Acelera o tempo de pesquisa e reduz erros de digitação

### PONTO POSITIVO #3
- **Título:** Cards de produto informativos
- **Descrição:** Cada card de produto exibe imagem, título, preço, rating e um badge com avaliação. Ana conseguiu comparar visualmente produtos rapidamente.
- **Zona da página:** Grid de resultados
- **Impacto:** Facilita a comparação rápida entre opções sem clicar em cada uma

### PONTO POSITIVO #4
- **Título:** Filtros por marca funcionam corretamente
- **Descrição:** Ao selecionar "Samsung" e "Apple", a grid atualizou imediatamente, mostrando apenas produtos dessas marcas. Feedback visual foi claro.
- **Zona da página:** Sidebar de filtros (esquerda)
- **Impacto:** Permite refinamento eficiente dos resultados

### PONTO POSITIVO #5
- **Título:** Ordenação por preço fluida
- **Descrição:** A dropdown de ordenação ("Mais barato", "Mais caro", "Mais vendido") funcionou sem delays. A grid atualizou-se instantaneamente.
- **Zona da página:** Acima dos resultados
- **Impacto:** Oferece controlo total sobre a visualização dos dados

---

### FRICÇÃO #1
- **Título:** Filtros avançados de especificações técnicas não visíveis no initial load
- **Severidade:** MÉDIO-ALTO
- **Descrição:** Os filtros de especificações técnicas (RAM, capacidade de armazenamento, taxa de refresh) só aparecem depois de descer na sidebar. Ana esperava vê-los expandidos ou com uma indicação clara de que existiam.
- **Zona da página:** Sidebar de filtros (esquerda)
- **Impacto estimado na conversão:** Reduz conversão em 12-15% porque utilizadores técnicos deixam de refinar a pesquisa

### FRICÇÃO #2
- **Título:** Sem indicador de "expandir mais filtros"
- **Severidade:** MÉDIO
- **Descrição:** Não existe um botão claro que diga "Ver mais filtros" ou ícone de seta expandível. Ana desceu por acaso e descobriu que havia mais opções abaixo.
- **Zona da página:** Footer da sidebar de filtros
- **Impacto estimado na conversão:** Reduz em ~8% porque utilizadores avançados deixam de usar filtros secundários

### FRICÇÃO #3
- **Título:** Comparação de produtos requer clicar em cada um
- **Severidade:** BAIXO-MÉDIO
- **Descrição:** Para comparar as especificações técnicas de dois smartphones, Ana precisa de clicar em cada um individualmente. Não existe função de "adicionar para comparar".
- **Zona da página:** Grid de resultados
- **Impacto estimado na conversão:** Reduz em ~5% para utilizadores técnicos que comparam múltiplas opções

### FRICÇÃO #4
- **Título:** Preço com imposto não é claro imediatamente
- **Severidade:** BAIXO
- **Descrição:** O preço exibido no card é com IVA, mas não está explícito. Ana só descobriu ao clicar no produto e ver o breakdown. Esperava ver "(com IVA)" no card.
- **Zona da página:** Cards de produto
- **Impacto estimado na conversão:** Impacto mínimo, afeta principalmente utilizadores price-sensitive

---

## Momentos de confusão
- **"Onde estão os filtros técnicos?"** — "Desci na sidebar e encontrei, mas achei estranho não estar visível desde o início"
- **"Este preço já inclui o IVA?"** — "Só descobri quando cliquei no produto"

---

## RESUMO EXECUTIVO

Ana Silva completou parcialmente o objetivo de pesquisar e filtrar um smartphone de gama alta. A experiência foi positiva nos aspetos fundamentais — barra de pesquisa clara, resultados bem apresentados, filtros básicos funcionais — mas foi prejudicada pela falta de visibilidade dos filtros técnicos avançados e pela ausência de uma função de comparação eficiente.

Para uma utilizadora tech-savvy como Ana, que tem expectativas elevadas sobre funcionalidades de filtro e comparação, esta jornada representa um atrito significativo que poderia levar a abandono se houvesse alternativas melhor otimizadas no mercado.

A conclusão parcial do objetivo deve-se especificamente ao facto de Ana ter conseguido encontrar o produto desejado, mas ter tido de investir esforço extra na descoberta de funcionalidades que deveriam ser óbvias. Isto reduz o confidence na plataforma para futuras compras técnicas.

---

## Recomendação Prioritária

**Tornar os filtros técnicos visíveis por padrão** ou implementar uma secção "Filtros avançados" colapsável com ícone de expansão claro. Isto é crítico para utilizadores técnicos e deve ser priorizado no próximo sprint de otimização de catálogo.

---

## Impacto Global na Conversão

Estimado em 10-15% de redução na conversão para segmento de utilizadores técnicos por produto, devido principalmente à invisibilidade dos filtros de especificações e à falta de funcionalidade de comparação eficiente.
