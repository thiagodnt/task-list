import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type FormEvent,
} from 'react';
import './App.css';

function App() {
	const [input, setInput] = useState<string>('');
	const [tasks, setTasks] = useState<string[]>([]);
	const [editTask, setEditTask] = useState({
		enabled: false,
		task: '',
	});

	const inputRef = useRef<HTMLInputElement>(null);
	const firstRenderRef = useRef<boolean>(true);

	// Aqui é só pra demonstração, já que o ideal é utilizá-lo para operações custosas
	const qtdTarefasMemo = useMemo(() => {
		return tasks.length;
	}, [tasks]);

	useEffect(() => {
		const localTaskList = localStorage.getItem('@task-list');
		if (localTaskList) {
			setTasks(JSON.parse(localTaskList));
		}
	}, []);

	useEffect(() => {
		inputRef.current?.focus();
	}, [tasks]);

	useEffect(() => {
		if (firstRenderRef.current) {
			firstRenderRef.current = false;
			return;
		}

		localStorage.setItem('@task-list', JSON.stringify(tasks));
	}, [tasks]);

	const handleAdicionar = useCallback(
		(e: FormEvent): void => {
			e.preventDefault();

			if (editTask.enabled) {
				handleSalvarEditar();
				return;
			}

			setTasks((t) => [...t, input]);
			setInput('');
		},
		[tasks, input]
	);

	function handleEditar(item: string): void {
		setInput(item);
		setEditTask({
			enabled: true,
			task: item,
		});
	}

	function handleSalvarEditar(): void {
		const indexTask = tasks.findIndex((task) => task === editTask.task);
		const allTasks = [...tasks];
		allTasks[indexTask] = input;

		setTasks(allTasks);
		setEditTask({
			enabled: false,
			task: '',
		});
		setInput('');
	}

	function handleRemover(item: string): void {
		const allTasks = tasks.filter((task) => task !== item);
		setTasks(allTasks);
	}

	return (
		<div className="container">
			<h1 className="title">Gerenciador de Tarefas</h1>
			<form onSubmit={handleAdicionar}>
				<label>
					<input
						type="text"
						placeholder="Digite aqui a sua tarefa"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						required
						ref={inputRef}
					/>
				</label>
				<button type="submit">
					{editTask.enabled ? 'Salvar' : 'Adicionar Tarefa'}
				</button>
			</form>
			<hr />
			<h1 className="task-count">
				{qtdTarefasMemo > 0
					? `Você tem ${qtdTarefasMemo} tarefa(s)!`
					: 'Nenhuma tarefa cadastrada'}
			</h1>
			{tasks.map((task, index) => (
				<section key={index} className="task-list">
					<span>{task}</span>
					<div className="actions">
						<button onClick={() => handleEditar(task)}>Editar</button>
						<button onClick={() => handleRemover(task)}>Excluir</button>
					</div>
				</section>
			))}
		</div>
	);
}

export default App;
