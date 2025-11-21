-- Script para corrigir a constraint de status_meta na tabela metafinanceira
-- Execute este script no PostgreSQL

-- 1. Remove a constraint antiga que está causando problema
ALTER TABLE metafinanceira 
DROP CONSTRAINT IF EXISTS metafinanceira_status_meta_check;

-- 2. Adiciona nova constraint permitindo valores 1 (Em andamento) e 2 (Conquistada)
ALTER TABLE metafinanceira 
ADD CONSTRAINT metafinanceira_status_meta_check 
CHECK (status_meta IN (1, 2));

-- 3. Verifica a constraint criada
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'metafinanceira_status_meta_check';
