
import React, { createContext, useState, useEffect, useCallback } from "react";
import { set, get, del } from "idb-keyval";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

    const [selectedBill, setSelectedBill] = useState(null); // ✅ novo estado


  // 🔹 Carregar dados do IndexedDB por ID
  const loadFormById = useCallback(async (id, initialData = {}) => {
    if (!id) return;
    setLoading(true);
    try {
      const savedData = await get(`rdo-${id}`);
      if (savedData) {
        setFormData(savedData);
      } else {
        const empty = { id, ...initialData };
        setFormData(empty);
        await set(`rdo-${id}`, empty);
      }
    } catch (err) {
      console.error("Erro ao carregar RDO:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ⬇️ AQUI entra o carregamento da foto
  useEffect(() => {
    async function loadFotos() {
      if (!formData?.id) return;

      const updates = {};
      for (const key of Object.keys(formData)) {
        if (key.endsWith("Key")) {
          const file = await get(formData[key]);
          if (file) {
            updates[key.replace("Key", "")] = URL.createObjectURL(file);
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        setFormData((prev) => ({ ...prev, ...updates }));
      }
    }
    loadFotos();
  }, [formData?.id]);

  // 🔹 Salvar automaticamente ao mudar formData
  useEffect(() => {
    if (!formData?.id) return;
    const save = async () => {
      try {
        await set(`rdo-${formData.id}`, formData);
      } catch (err) {
        console.error("Erro ao salvar RDO:", err);
      }
    };
    save();
  }, [formData]);

  // 🔹 Alterar campo simples
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Adicionar item a lista
  const handleAddItem = (field, item) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), item],
    }));
  };

  // 🔹 Remover item da lista
  const handleRemoveItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };


  const handleFileChangeField = (formData, setFormData) => (field) => async (file) => {
    if (!file || !formData?.id) return;

    const key = `rdo-${formData.id}-${field}`;
    await set(key, file);

    const url = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      [field]: url,       // URL para preview
      [`${field}Key`]: key, // chave para recuperar do IndexedDB
    }));
  };


  // 🔹 Limpar dados de um ID específico
  const clearFormById = async (id) => {
    if (!id) return;
    setFormData({});
    await del(`rdo-${id}`);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        loadFormById,
        handleChange,
        handleAddItem,
        handleRemoveItem,
        handleFileChangeField,
        clearFormById,
        loading,
        selectedBill,     // ✅ expõe no contexto
        setSelectedBill,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};