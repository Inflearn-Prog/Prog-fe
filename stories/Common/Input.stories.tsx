import type { Meta, StoryObj } from "@storybook/nextjs";
import { CircleSlashIcon, MailIcon, SearchIcon, UserIcon } from "lucide-react";

import { BaseInput, IconInput } from "@/components/shared/inputs";

import { StoryBox } from "../StoryBox";

const STORY_PARAMETERS = {
  layout: "centered" as const,
  docs: {
    description: {
      component: "공통 입력 필드 컴포넌트들의 다양한 상태와 변형을 보여줍니다.",
    },
  },
};

const COMMON_ARG_TYPES = {
  inputSize: {
    control: { type: "select" as const },
    options: ["md", "lg"],
    description: "입력 필드의 크기를 지정합니다.",
  },
  rounded: {
    control: { type: "boolean" as const },
    description: "입력 필드의 모서리를 둥글게 처리할지 여부를 설정합니다.",
  },
  disabled: {
    control: { type: "boolean" as const },
    description: "입력 필드의 비활성화 상태를 설정합니다.",
  },
  placeholder: {
    control: { type: "text" as const },
    description: "입력 필드의 플레이스홀더 텍스트를 설정합니다.",
  },
};

const baseInputMeta: Meta<typeof BaseInput> = {
  title: "Components/Shared/Inputs",
  component: BaseInput,
  parameters: STORY_PARAMETERS,
  argTypes: COMMON_ARG_TYPES,
  args: {
    name: "baseInput",
    placeholder: "텍스트를 입력해주세요",
    inputSize: "md",
    rounded: false,
    disabled: false,
  },
};

export default baseInputMeta;

type BaseInputStory = StoryObj<typeof BaseInput>;

// BaseInput 기본 스토리
export const Default: BaseInputStory = {};

// BaseInput 크기별 스토리
export const MediumSize: BaseInputStory = {
  args: {
    inputSize: "md",
    placeholder: "중간 크기 입력 필드",
  },
  render: (args) => (
    <StoryBox>
      <BaseInput {...args} />
    </StoryBox>
  ),
};

export const LargeSize: BaseInputStory = {
  args: {
    inputSize: "lg",
    placeholder: "큰 크기 입력 필드",
  },
  render: (args) => (
    <StoryBox>
      <BaseInput {...args} />
    </StoryBox>
  ),
};

// BaseInput 모서리 둥근 형태 스토리
export const Rounded: BaseInputStory = {
  args: {
    rounded: true,
    placeholder: "둥근 모서리 입력 필드",
  },
  render: (args) => (
    <StoryBox>
      <BaseInput {...args} />
    </StoryBox>
  ),
};

// BaseInput 비활성화 상태 스토리
export const Disabled: BaseInputStory = {
  args: {
    disabled: true,
    placeholder: "비활성화된 입력 필드",
    value: "수정할 수 없는 텍스트",
  },
  render: (args) => (
    <StoryBox>
      <BaseInput {...args} />
    </StoryBox>
  ),
};

// BaseInput 모든 크기와 형태 조합 스토리
export const AllVariants: BaseInputStory = {
  render: (args) => (
    <StoryBox>
      <div className="space-y-4 w-80">
        <div>
          <label className="block text-sm font-medium mb-2">
            기본 중간 크기
          </label>
          <BaseInput {...args} name="variant1" inputSize="md" rounded={false} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">기본 큰 크기</label>
          <BaseInput {...args} name="variant2" inputSize="lg" rounded={false} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            둥근 중간 크기
          </label>
          <BaseInput {...args} name="variant3" inputSize="md" rounded={true} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">둥근 큰 크기</label>
          <BaseInput {...args} name="variant4" inputSize="lg" rounded={true} />
        </div>
      </div>
    </StoryBox>
  ),
  args: {
    placeholder: "다양한 형태의 입력 필드",
  },
};

type IconInputStory = StoryObj<typeof IconInput>;

// IconInput 크기별 스토리
export const WithSearchIcon: IconInputStory = {
  render: (args) => (
    <StoryBox>
      <div className="space-y-4 w-80">
        <div>
          <label className="block text-sm font-medium mb-2">중간 크기</label>
          <IconInput
            {...args}
            name="iconSize1"
            inputSize="md"
            placeholder="중간 크기 아이콘 입력 필드"
          />
        </div>
      </div>
    </StoryBox>
  ),
  args: {
    icon: <SearchIcon className="w-5 h-5 text-gray-400" />,
  },
};

// IconInput 크기별 스토리
export const IconInputSizes: IconInputStory = {
  render: (args) => (
    <StoryBox>
      <div className="space-y-4 w-80">
        <div>
          <label className="block text-sm font-medium mb-2">중간 크기</label>
          <IconInput
            {...args}
            name="iconSize1"
            inputSize="md"
            placeholder="중간 크기 아이콘 입력 필드"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">큰 크기</label>
          <IconInput
            {...args}
            name="iconSize2"
            inputSize="lg"
            placeholder="큰 크기 아이콘 입력 필드"
          />
        </div>
      </div>
    </StoryBox>
  ),
  args: {
    icon: <SearchIcon className="w-5 h-5 text-gray-400" />,
  },
};

// IconInput 비활성화 상태 스토리
export const IconInputDisabled: IconInputStory = {
  render: (args) => (
    <StoryBox>
      <div className="space-y-4 w-80">
        <div>
          <label className="block text-sm font-medium mb-2">중간 크기</label>
          <IconInput
            {...args}
            disabled
            name="iconSize1"
            inputSize="md"
            icon={<CircleSlashIcon className="w-5 h-5 text-gray-300" />}
            placeholder="중간 크기 아이콘 입력 필드"
          />
        </div>
      </div>
    </StoryBox>
  ),
};

// IconInput 모든 변형 스토리
export const IconInputAllVariants: IconInputStory = {
  render: (args) => (
    <StoryBox>
      <div className="space-y-6 w-96">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">기본 형태</h3>
          <IconInput
            {...args}
            name="all1"
            icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
            placeholder="기본 검색 필드"
          />
          <IconInput
            {...args}
            name="all2"
            icon={<UserIcon className="w-5 h-5 text-gray-400" />}
            placeholder="사용자명 입력 필드"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">둥근 모서리</h3>
          <IconInput
            {...args}
            name="all3"
            rounded={true}
            icon={<MailIcon className="w-5 h-5 text-gray-400" />}
            placeholder="둥근 이메일 입력 필드"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">큰 크기</h3>
          <IconInput
            {...args}
            name="all4"
            inputSize="lg"
            icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
            placeholder="큰 크기 검색 필드"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">비활성화</h3>
          <IconInput
            {...args}
            name="all5"
            disabled={true}
            icon={<UserIcon className="w-5 h-5" />}
            placeholder="비활성화된 필드"
            value="수정 불가능"
          />
        </div>
      </div>
    </StoryBox>
  ),
};
