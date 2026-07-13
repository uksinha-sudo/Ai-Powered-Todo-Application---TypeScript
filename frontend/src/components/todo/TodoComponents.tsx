import { useState, type FormEvent, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { GlassInput, GlassButton } from "../ui";
import { Plus, Loader2, Trash2, Edit, CheckCircle, Clock } from "lucide-react";

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const TodoForm = ({
  onAdd,
  placeholder = "What needs to be done?",
  loading = false,
  disabled = false,
}: TodoFormProps) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting || disabled) return;

    setIsSubmitting(true);
    try {
      await onAdd(text.trim());
      setText("");
      inputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-2 sm:gap-3">
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <GlassInput
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            leftIcon={<Plus className="h-4 w-4 sm:h-5 sm:w-5 text-text-muted" />}
            variant="default"
            size="sm"
            fullWidth
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassButton
            type="submit"
            variant="primary"
            size="md"
            fullWidth={false}
            loading={isSubmitting || loading}
            disabled={!text.trim() || disabled}
            className="w-full sm:w-auto min-w-[100px] sm:min-w-[120px]"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" aria-hidden="true" />
            <span className="hidden sm:inline">Add Task</span>
          </GlassButton>
        </motion.div>
      </div>
    </motion.form>
  );
};

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (id: string, newText: string) => Promise<void>;
}

export const TodoItem = ({
  id,
  text,
  completed,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      await onToggle(id, !completed);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editText.trim() || editText === text || !onEdit) return;
    try {
      await onEdit(id, editText.trim());
      setIsEditing(false);
    } catch {
      setEditText(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditText(text);
      setIsEditing(false);
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit(e);
    }
  };

  return (
    <motion.li
      className="group relative"
      layout
      initial={{ opacity: 0, height: 0, x: -20 }}
      animate={{ opacity: 1, height: "auto", x: 0 }}
      exit={{ opacity: 0, height: 0, x: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className={`
          flex items-center gap-3 p-4 rounded-xl
          bg-bg-card border border-border/30
          hover:bg-bg-elevated hover:border-border-hover
          transition-all duration-300
          ${completed ? "opacity-60" : ""}
        `}
        whileHover={{ x: 4 }}
      >
        <motion.button
          onClick={handleToggle}
          disabled={isToggling}
          className={`
            relative flex-shrink-0 w-6 h-6 rounded-lg border-2
            transition-all duration-200
            ${completed
              ? "bg-accent/10 border-accent/50"
              : "border-border/30 hover:border-accent/50"
            }
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg
          `}
          whileTap={{ scale: 0.9 }}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed && (
            <motion.svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </motion.button>

        {isEditing ? (
          <motion.form
            onSubmit={handleEditSubmit}
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleEditSubmit}
              autoFocus
              className="w-full bg-transparent text-text placeholder:text-text-muted text-base outline-none pr-4"
            />
          </motion.form>
        ) : (
          <motion.p
            className={`
              flex-1 min-w-0 text-base text-text break-words
              transition-colors duration-200
              ${completed ? "line-through text-text-muted" : ""}
            `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {text}
          </motion.p>
        )}

        <motion.div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {onEdit && !completed && (
            <motion.button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-bg-elevated transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Edit task"
            >
              <Edit className="h-5 w-5" />
            </motion.button>
          )}

          <motion.button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            aria-label="Delete task"
          >
            {isDeleting ? (
              <motion.div
                className="h-5 w-5 animate-spin"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-full w-full" />
              </motion.div>
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
          </motion.button>
        </motion.div>
      </motion.div>

      {completed && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent rounded-xl pointer-events-none"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          exit={{ opacity: 0, width: 0 }}
        />
      )}
    </motion.li>
  );
};

interface TodoStatsProps {
  total: number;
  completed: number;
  pending: number;
}

export const TodoStats = ({ total, completed, pending }: TodoStatsProps) => {
  return (
    <motion.div
      className="flex flex-wrap items-center gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <motion.div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
      >
        <CheckCircle className="h-4 w-4 text-success" />
        <span className="text-text-muted font-medium">Completed: <strong className="text-text">{completed}</strong></span>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Clock className="h-4 w-4 text-warning" />
        <span className="text-text-muted font-medium">Pending: <strong className="text-text">{pending}</strong></span>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-border/30 border border-border"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
      >
        <span className="h-4 w-4 rounded-full bg-accent/30" />
        <span className="text-text-muted font-medium">Total: <strong className="text-text">{total}</strong></span>
      </motion.div>
    </motion.div>
  );
};

interface TodoListProps {
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (id: string, newText: string) => Promise<void>;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  isLoading?: boolean;
}

const listVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export const TodoList = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
  emptyMessage = "No tasks yet. Add one above!",
  emptyAction,
  isLoading = false,
}: TodoListProps) => {
  if (isLoading) {
    return (
      <motion.ul className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {[...Array(3)].map((_, i) => (
          <motion.li key={i} className="h-16">
            <motion.div className="h-full w-full bg-bg-card/60 border border-border/30 rounded-xl animate-pulse" />
          </motion.li>
        ))}
      </motion.ul>
    );
  }

  if (todos.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-12 px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="w-16 h-16 rounded-2xl bg-bg-card/60 border border-border/30 flex items-center justify-center mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </motion.div>
        <motion.p className="text-text-muted text-lg font-medium" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {emptyMessage}
        </motion.p>
        <motion.p className="text-text-subtle text-sm mt-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          Start by adding a new task using the form above
        </motion.p>
        {emptyAction && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4">
            {emptyAction}
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.ul className="space-y-3" variants={listVariants} initial="initial" animate="animate">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          text={todo.text}
          completed={todo.completed}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </motion.ul>
  );
};