(function(){
	angular.module('imdbApp').controller('quizCtrl', ['$scope','$v.Math', '$http', function($scope, $math, $http){
		
		//Limpa dados de questão e vai para a próxima questão
		$scope.nextQuestion = function(){
			//Verifica se já respondeu todas as questões
			if ($scope.infos.current==10){
				$scope.terminou = true;								
			}else{
				$scope.question = {
					nome:'',
					img: '',
					person_id: '',
					acertou : false,
					respondeu:false,
					resposta:''
				}
				$scope.msg = '';
				$scope.dica = '';
				$scope.flagDesisto = false;
				$scope.infos.current++;

				$scope.getQuestion();
			}
		}
		
		$scope.getQuestion = function(){
			$scope.loading = true;
			//Busca informações de um ator com id randômico entre 1 e 9999
			$http.get('http://www.theimdbapi.org/api/person?person_id=nm' + $math.randomRange(1,9999)).then(
				function(res){
					//Caso não exista imagem para o ator encontrado, busca novamente
					if (res.data.image.thumb == '')
						$scope.getQuestion();
					else{
						$scope.loading = false;
						$scope.question.nome = res.data.title;
						$scope.question.img = res.data.image.thumb;
						$scope.question.person_id = res.data.person_id;
						console.log(res.data);
					}					
				},
				function(err){
					$scope.loading = false;
					console.log(err);
				}
			);
		};
		
		$scope.desisto = function(){
			//não faz nada se ainda houverem informações carregando
			if ($scope.loading) return;
			//flag para detectar quando o usuário usou dica para a questão
			$scope.flagDesisto = true;
			$scope.dica = $scope.question.nome;
		}
		
		//Inicia/Reinicia uma partida				
		$scope.newQuiz = function(){
			$scope.msg = '';
			$scope.dica = '';
			$scope.flagDesisto = false;
			$scope.terminou = false;

			$scope.loading = false;

			$scope.infos = {
				current :0,
				pontos : 0
			}
			
			$scope.nextQuestion();
		}
		
		$scope.responder = function(){
			//não deixa o usuário responder novamente caso ele já tenha acertado, para evitar ganhar mais pontos do que o devido
			if ($scope.question.respondeu) return;
			if ($scope.question.resposta.toUpperCase() == $scope.question.nome.toUpperCase()){
				$scope.question.acertou = true;
				$scope.msg = "Parabéns você acertou!"
				//não soma ponto se o usuário usou a dica
				if (!$scope.flagDesisto)
					$scope.infos.pontos++;
			}else{				
				$scope.question.acertou = false;
				$scope.msg = "Que pena, você errou!"
				$scope.infos.pontos--;
			}
			
			$scope.question.respondeu = true;
		}
		
		$scope.newQuiz();
		
	}] );
})();