import {
  useEffect,
  useState,
} from 'react';

import { serviceService } from '../services/service.service';

import {
  formatCentsForInput,
  parseCurrencyInputToCents,
} from '../utils/currency';

import { getApiErrorMessage } from '../utils/error';

export function useServiceForm(serviceId?: string) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('60');
  const [priceSmall, setPriceSmall] = useState('');
  const [priceMedium, setPriceMedium] = useState('');
  const [priceLarge, setPriceLarge] = useState('');
  const [loading, setLoading] = useState(Boolean(serviceId));
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!serviceId) {
      return;
    }

    serviceService
      .findByIdForAdmin(serviceId)
      .then((service) => {
        setName(service.name);
        setDescription(service.description);
        setDuration(String(service.durationMinutes));
        setPriceSmall(
          formatCentsForInput(service.priceSmallInCents),
        );
        setPriceMedium(
          formatCentsForInput(service.priceMediumInCents),
        );
        setPriceLarge(
          formatCentsForInput(service.priceLargeInCents),
        );
      })
      .catch((error: unknown) => {
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível carregar o serviço.',
          ),
        );
      })
      .finally(() => setLoading(false));
  }, [serviceId]);

  async function save(): Promise<boolean> {
    setErrorMessage('');

    if (name.trim().length < 2) {
      setErrorMessage(
        'O nome deve possuir pelo menos 2 caracteres.',
      );

      return false;
    }

    if (description.trim().length < 5) {
      setErrorMessage(
        'A descrição deve possuir pelo menos 5 caracteres.',
      );

      return false;
    }

    const durationMinutes = Number(duration.trim());

    if (
      !Number.isInteger(durationMinutes) ||
      durationMinutes < 30 ||
      durationMinutes % 30 !== 0
    ) {
      setErrorMessage(
        'A duração deve ser múltipla de 30 minutos.',
      );

      return false;
    }

    const prices = [priceSmall, priceMedium, priceLarge].map(
      parseCurrencyInputToCents,
    );

    if (prices.some((price) => price === null || price <= 0)) {
      setErrorMessage(
        'Informe um preço válido para cada porte.',
      );

      return false;
    }

    const data = {
      name: name.trim(),
      description: description.trim(),
      durationMinutes,
      priceSmallInCents: prices[0] as number,
      priceMediumInCents: prices[1] as number,
      priceLargeInCents: prices[2] as number,
    };

    try {
      setSaving(true);

      if (serviceId) {
        await serviceService.update(serviceId, data);
      } else {
        await serviceService.create(data);
      }

      return true;
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível salvar o serviço.',
        ),
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  async function remove(): Promise<boolean> {
    if (!serviceId) {
      return false;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      await serviceService.remove(serviceId);

      return true;
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível excluir o serviço.',
        ),
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    name,
    description,
    duration,
    priceSmall,
    priceMedium,
    priceLarge,
    loading,
    saving,
    errorMessage,
    setName,
    setDescription,
    setDuration,
    setPriceSmall,
    setPriceMedium,
    setPriceLarge,
    save,
    remove,
  };
}
