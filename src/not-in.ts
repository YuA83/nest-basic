import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function NotIn(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      // ValidationDecoratorOprtions를 인수로 받음
      name: 'NotIn', // 데코레이터 이름
      target: object.constructor, // 이 데코레이터는 객체가 생설될 때 적용
      propertyName,
      options: validationOptions, // 유효성 옵션
      constraints: [property], // 해당 데코레이터가 속성에 적용되도록 제약
      validator: {
        // 유효성 검사 규칙
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            !relatedValue.includes(value)
          );
        },
      },
    });
  };
}
