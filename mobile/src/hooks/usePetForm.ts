import {
  useEffect,
  useState,
} from 'react';

import { petService } from '../services/pet.service';

import type { PetSize } from '../types/pet';
import type { Species } from '../types/product';

import { getApiErrorMessage } from '../utils/error';

import {
  formatBirthDate,
  parseBirthDate,
  parseWeight,
} from '../utils/validacoes';

export function usePetForm(petId?: string) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('CAO');
  const [breed, setBreed] = useState('');
  const [size, setSize] = useState<PetSize>('M');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(Boolean(petId));
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!petId) {
      return;
    }

    petService
      .findById(petId)
      .then((pet) => {
        setName(pet.name);
        setSpecies(pet.species);
        setBreed(pet.breed ?? '');
        setSize(pet.size);
        setBirthDate(formatBirthDate(pet.birthDate));
        setWeight(
          pet.weightKg === null
            ? ''
            : String(pet.weightKg).replace('.', ','),
        );
        setNotes(pet.notes ?? '');
      })
      .catch((error: unknown) => {
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível carregar o pet.',
          ),
        );
      })
      .finally(() => setLoading(false));
  }, [petId]);

  async function save(): Promise<boolean> {
    setErrorMessage('');

    if (name.trim().length < 2) {
      setErrorMessage(
        'O nome deve possuir pelo menos 2 caracteres.',
      );

      return false;
    }

    const parsedBirthDate = parseBirthDate(birthDate);

    if (parsedBirthDate === undefined) {
      setErrorMessage(
        'Informe o nascimento no formato DD/MM/AAAA.',
      );

      return false;
    }

    const parsedWeight = parseWeight(weight);

    if (parsedWeight === undefined) {
      setErrorMessage('Informe um peso válido.');

      return false;
    }

    const data = {
      name: name.trim(),
      species,
      breed: breed.trim() || null,
      size,
      birthDate: parsedBirthDate,
      weightKg: parsedWeight,
      notes: notes.trim() || null,
    };

    try {
      setSaving(true);

      if (petId) {
        await petService.update(petId, data);
      } else {
        await petService.create(data);
      }

      return true;
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível salvar o pet.',
        ),
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  async function remove(): Promise<boolean> {
    if (!petId) {
      return false;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      await petService.remove(petId);

      return true;
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível excluir o pet.',
        ),
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    name,
    species,
    breed,
    size,
    birthDate,
    weight,
    notes,
    loading,
    saving,
    errorMessage,
    setName,
    setSpecies,
    setBreed,
    setSize,
    setBirthDate,
    setWeight,
    setNotes,
    save,
    remove,
  };
}
