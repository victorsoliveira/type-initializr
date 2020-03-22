# TypeInitializr - Uma ferramenta para instanciar classes existentes baseasas em modelos com valores padrões.

Com essa biblioteca conseguimos criar instâncias de classes no typescript, baseadas em um tipo onde as propriedades não necessáriamente precisam existir, sem perder as características do modelo como métodos, outros valores de propriedades públicas e etc.

## Conteúdo

 1. [Instalação e Utilização](#instacalcao-e-configuracao)
 2. [Observações Gerais](#observacoes-gerais)

## <a name="instacalcao-e-configuracao"></a>Instalação e Utilização


### Instalação

Vamos lá, primeiramente você terá que instalar a biblioteca
```
$ npm install type-initializr
```

Após instalada será só importar a classe onde será feita a utilização em seu código
```
import { TypeInitialzr } from 'type-initializr';
```

### Utilização

#### Simples
Considerem a classe de exemplo abaixo, digamos que você possua essa classe em sua aplicação  e necessita gerar uma insância dela a partir de um objeto qualquer *any* que você tenha em memória podendo ser retorno de uma  *API REST* ou não:
```
class  Foo {
	public  value:  string;
	public  getValue():  string  |  undefined {
		return  this.value;
	}
}
```
Ao executarmos o código abaixo uma instância da classe **Foo** será gerada e a sua propriedade *value* será peenchida com o valor *foo* como visto abaixo.
```
let result = TypeInitialzr.init(Foo, { value:  'foo' })
```
Agora a partir da sua variável *result* você possui uma instância de **Foo** podendo acessar a propriedade `result.value` ou até mesmo chamar o método `result.getValue()` normalmente.

#### Com referência a outras classes
Agora vamos analisar o possível caso abaixo: 
```
class  Bar {
	public  value:  string;
	public  getValue():  string  |  undefined {
		return  this.value;
	}
}
class  Foo {
	public  value:  string;
	@init(Bar) public  bar:  Bar;
	public  getValue():  string  |  undefined {
		return  this.value;
	}
}
```
Digamos que você possua essas duas classes na sua aplicação e queira instãnciar **Foo** porém caso o seu modelo tem informações de **Bar** e você necessita que o mesmo também seja instanciado, é simples, apenas decore a propriedade da referência com o decorador `@init(Type)`, onde *Type* será o tipo da classe, nesse caso *Bar*, então, ficará assim `@init(Bar)`, feito isso, ao executar o código abaixo a propriedade `bar` será preenchida como se deve de acordo com a execução abaixo:
```
let  result  =  TypeInitialzr.init(Foo, { value:  'foo', bar: { value:  'bar' } });
```

## <a name="observacoes-gerais"></a>Observações Gerais

 1. Caso vá utilizar a funcionalidade de inicializar propriedades que sejam de outros tipos (classes) aninhadas ao modelo principal você precisará usar nosso decorador de propriedades `@init(Type)` passando o tipo como argumento **Type** e para isso será necessário utilizar a configuração no *tsconfig.json*

```
{ 
	"compilerOptions": { "experimentalDecorators" : true }
}
```