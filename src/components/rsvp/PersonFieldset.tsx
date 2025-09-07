import { Fragment } from 'react';
import { OpenInExternalLink } from '../OpenInExternalLink';
import { RadioGroup } from './RadioGroup';
import {
  FOOD_OPTIONS,
  isValidFoodOption,
  type FoodOptionId,
} from './utils/foodOptions';

interface PersonFieldsetProps {
  person: {
    name: string;
    attendingCeremony: boolean | null;
    attendingReception: boolean | null;
    attendingBrunch: boolean | null;
    dietaryRestrictions: string;
    foodOption: FoodOptionId | null;
    contactInfo: string;
    isNameEditable?: boolean;
    allowedToAttendBrunch?: boolean;
  };
  onPersonChange: {
    attendingCeremony: (value: boolean | null) => void;
    attendingReception: (value: boolean | null) => void;
    attendingBrunch: (value: boolean | null) => void;
    dietaryRestrictions: (value: string) => void;
    foodOption: (value: FoodOptionId | null) => void;
    contactInfo: (value: string) => void;
    name: (value: string) => void;
  };
  personType: 'invitee' | 'guest';
  guestNumber?: number;
  isRequired?: boolean;
}

export function PersonFieldset({
  person,
  onPersonChange,
  personType,
  guestNumber,
  isRequired = true,
}: PersonFieldsetProps) {
  const fieldPrefix =
    personType === 'invitee' ? 'invitee' : `guest-${guestNumber}`;
  const displayName =
    personType === 'invitee' ? person.name : `Guest ${guestNumber}`;
  const legendText =
    personType === 'invitee' ? 'Your Response' : `Guest ${guestNumber}`;

  // Determine if fields should be required based on attendance
  const shouldRequireFields =
    isRequired &&
    (person.attendingCeremony === true ||
      person.attendingReception === true ||
      person.attendingBrunch === true);

  return (
    <fieldset className="space-y-4 border p-4 rounded shadow-xl">
      <legend className="sr-only font-medium m-0">{legendText}</legend>
      <div>
        {person.isNameEditable ? (
          <Fragment>
            <label
              htmlFor={`${fieldPrefix}-name`}
              className="block mb-1 font-medium"
            >
              {displayName} Full Name{' '}
              {shouldRequireFields && <span className="text-red-600">*</span>}
            </label>
            <input
              id={`${fieldPrefix}-name`}
              type="text"
              value={person.name}
              onChange={e => onPersonChange.name(e.target.value)}
              placeholder={`${displayName} Full Name`}
              required={shouldRequireFields}
              className="w-full p-2 border rounded bg-white focus:outline-none focus:ring"
            />
          </Fragment>
        ) : (
          <p className="text-xl font-bold break-all m-0">{person.name}</p>
        )}
        <p className="text-lg m-0">
          Will {personType === 'invitee' ? 'you' : 'they'} be attending the...
        </p>
      </div>

      <div className="grid sm:grid-cols-2 items-center gap-2">
        <p className="font-medium">
          Ceremony? <span className="text-red-600">*</span>
        </p>
        <RadioGroup
          name={`${fieldPrefix}-attendingCeremony`}
          value={person.attendingCeremony}
          onChange={onPersonChange.attendingCeremony}
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 items-center gap-2">
        <p className="font-medium">
          Reception? <span className="text-red-600">*</span>
        </p>
        <RadioGroup
          name={`${fieldPrefix}-attendingReception`}
          value={person.attendingReception}
          onChange={onPersonChange.attendingReception}
          required
        />
      </div>

      {person.attendingReception === true && (
        <div className="space-y-4">
          <div>
            <p className="font-medium text-lg">
              Dinner Selection <span className="text-red-600">*</span>
            </p>
            <p className="text-sm mb-4">
              Please select {personType === 'invitee' ? 'your' : 'their'}{' '}
              preferred dinner option for the reception.
            </p>
          </div>

          <div className="space-y-3">
            {FOOD_OPTIONS.map(option => (
              <label
                key={option.id}
                className={`flex items-start space-x-3 p-3 rounded cursor-pointer hover:bg-flax-smoke-100 focus-within:ring-2 ring-stone-500 ${
                  person.foodOption === option.id
                    ? 'ring-2 bg-flax-smoke-100'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name={`${fieldPrefix}-foodOption`}
                  value={option.id}
                  checked={person.foodOption === option.id}
                  onChange={e => {
                    const value = e.target.value;
                    if (isValidFoodOption(value)) {
                      onPersonChange.foodOption(value);
                    }
                  }}
                  className="sr-only peer"
                  required
                />
                <span className="w-5 h-5 flex-shrink-0 border rounded-full border-black peer-checked:-stone-600 peer-checked:bg-stone-600 transition mt-1" />
                <div className="flex-1">
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {person.allowedToAttendBrunch && (
        <div className="grid sm:grid-cols-2 items-center gap-2">
          <div className="flex flex-col">
            <p className="font-medium">
              Day After Brunch? <span className="text-red-600">*</span>
            </p>
            <p className="text-sm max-w-[34ch]">
              Casual morning brunch the day after the wedding for close friends
              and family at the{' '}
              <OpenInExternalLink
                title="Archer Hotel"
                url="https://www.archerhotel.com/redmond"
              />{' '}
              in Redmond, WA on June 19, 2026 at 10:00AM PDT.
            </p>
          </div>
          <RadioGroup
            name={`${fieldPrefix}-attendingBrunch`}
            value={person.attendingBrunch}
            onChange={onPersonChange.attendingBrunch}
            required
          />
        </div>
      )}

      {(person.attendingReception === true ||
        person.attendingCeremony === true ||
        person.attendingBrunch === true) && (
        <div className="mt-4">
          <label
            className="block mb-1 font-medium"
            htmlFor={`${fieldPrefix}-contactInfo`}
          >
            Phone or Email{' '}
            {(personType === 'invitee' || person.foodOption === 'unknown') && (
              <span className="text-red-600">*</span>
            )}
          </label>
          <input
            type="text"
            id={`${fieldPrefix}-contactInfo`}
            value={person.contactInfo}
            onChange={e => onPersonChange.contactInfo(e.target.value)}
            placeholder="Phone number or email address"
            className="w-full p-2 border bg-white rounded focus:outline-none focus:ring"
            required={
              personType === 'invitee' || person.foodOption === 'unknown'
            }
          />
          {person.foodOption === 'unknown' ? (
            <p className="text-sm mt-1">
              We'll reach out to discuss{' '}
              {personType === 'invitee' ? 'your' : 'their'} dinner options. If
              we are unable to connect, the Chicken Entrée will be selected by
              default.
            </p>
          ) : (
            <p className="text-sm mt-1">
              Please provide{' '}
              {personType === 'invitee' ? 'required' : 'optional'} contact
              information for any wedding updates and questions.
            </p>
          )}
        </div>
      )}

      <div>
        <label
          className="block mb-1 font-medium"
          htmlFor={`${fieldPrefix}-dietaryRestrictions`}
        >
          Dietary Restrictions or Comments
        </label>
        <input
          type="text"
          value={person.dietaryRestrictions}
          id={`${fieldPrefix}-dietaryRestrictions`}
          onChange={e => onPersonChange.dietaryRestrictions(e.target.value)}
          placeholder="e.g. Vegetarian, Gluten-free…"
          className="w-full p-2 border rounded bg-white focus:outline-none focus:ring"
        />
      </div>
    </fieldset>
  );
}
