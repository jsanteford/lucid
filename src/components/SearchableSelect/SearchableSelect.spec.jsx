import React from 'react';
import { mount, shallow } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import { filterTypes, rejectTypes } from '../../util/component-types';
import _ from 'lodash';
import { common } from '../../util/generic-tests';
import SearchableSelect from './SearchableSelect';
import DropMenu from '../DropMenu/DropMenu';

const {
	Placeholder,
	Option,
	OptionGroup,
	SearchField,
} = SearchableSelect;

describe('SearchableSelect', () => {
	common(SearchableSelect, {
		exemptFunctionProps: [
			'optionFilter',
			'richChildRenderer',
		],
	});

	describe('render', () => {
		it('should render a DropMenu', () => {
			const wrapper = shallow(
				<SearchableSelect>
					<Placeholder>control</Placeholder>
					<Option>option a</Option>
					<Option>option b</Option>
					<Option>option c</Option>
				</SearchableSelect>
			);

			assert.equal(wrapper.find('DropMenu').length, 1);
		});
	});

	describe('props', () => {
		describe('children', () => {
			it('should not render any direct child elements which are not SearchableSelect-specific', () => {
				const wrapper = shallow(
					<SearchableSelect>
						<button>button</button>
						<Placeholder>control<i>italic</i></Placeholder>
						<Option>option a</Option>
						<Option>option b</Option>
						<Option>option c</Option>
						<h1>header</h1>
					</SearchableSelect>
				);

				assert.equal(wrapper.find('button').length, 0);
				assert.equal(wrapper.find('h1').length, 0);
				assert.equal(wrapper.find('i').length, 1);
			});
		});

		describe('hasReset', () => {
			let wrapper;

			afterEach(() => {
				if (wrapper) {
					wrapper.unmount();
				}
			});

			it('should render the placeholder option as the first one in the menu and be a null option', () => {
				wrapper = mount(
					<SearchableSelect hasReset={true} selectedIndex={1} DropMenu={{ isExpanded: true }}>
						<Placeholder>select one</Placeholder>
						<Option>option a</Option>
						<Option>option b</Option>
						<Option>option c</Option>
					</SearchableSelect>
				);

				const menuDOMNode = document.querySelector('.lucid-ContextMenu-FlyOut .lucid-DropMenu-option-container');

				assert(_.includes(menuDOMNode.children[0].className, 'lucid-DropMenu-Option-is-null'));
			});

			it('should not render the placeholder null option as the first one in the menu', () => {
				wrapper = mount(
					<SearchableSelect hasReset={false} selectedIndex={1} DropMenu={{ isExpanded: true }}>
						<Placeholder>select one</Placeholder>
						<Option>option a</Option>
						<Option>option b</Option>
						<Option>option c</Option>
					</SearchableSelect>
				);

				const menuDOMNode = document.querySelector('.lucid-ContextMenu-FlyOut .lucid-DropMenu-option-container');

				assert(!_.includes(menuDOMNode.children[0].className, 'lucid-DropMenu-Option-is-null'));
			});
		});

		describe('isDisabled', () => {
			it('should pass the `isDisabled` prop thru to the underlying DropMenu', () => {
				const wrapper = shallow(
					<SearchableSelect isDisabled={true}>
						<Placeholder>select one</Placeholder>
						<Option>option a</Option>
						<Option>option b</Option>
						<Option>option c</Option>
					</SearchableSelect>
				);

				const dropMenuWrapper = wrapper.find('DropMenu');

				assert.equal(dropMenuWrapper.prop('isDisabled'), true);
			});

			it('should apply the appropriate classNames to the control', () => {
				const wrapper = shallow(
					<SearchableSelect isDisabled={true} selectedIndex={2}>
						<Placeholder>select one</Placeholder>
						<Option>option a</Option>
						<Option>option b</Option>
						<Option>option c</Option>
					</SearchableSelect>
				);

				const controlWrapper = wrapper.find('.lucid-SearchableSelect-Control');

				assert(controlWrapper.hasClass('lucid-SearchableSelect-Control-is-disabled'));
				assert(!controlWrapper.hasClass('lucid-SearchableSelect-Control-is-selected'));
			});
		});

		describe('isLoading', () => {
			it('should render a &-Loading Option and disable all Options', () => {
				const wrapper = shallow(
					<SearchableSelect isLoading>
						<Placeholder>select one</Placeholder>
						<Option>option a</Option>
						<Option>option b</Option>
						<Option>option c</Option>
					</SearchableSelect>
				);

				const options = wrapper.find(DropMenu).shallow().find('.lucid-DropMenu-Option');

				// first option should be the loading indicator.
				assert(options.at(0).hasClass('lucid-SearchableSelect-Loading'));
				assert(options.every('.lucid-DropMenu-Option-is-disabled'));
			});
		});

		describe('isSelectionHighlighted', () => {
			describe('default', () => {
				it('should apply the appropriate classNames to the control', () => {
					const wrapper = shallow(
						<SearchableSelect selectedIndex={2}>
							<Placeholder>select one</Placeholder>
							<Option>option a</Option>
							<Option>option b</Option>
							<Option>option c</Option>
						</SearchableSelect>
					);
					const controlWrapper = wrapper.find('.lucid-SearchableSelect-Control');
					assert(controlWrapper.hasClass('lucid-SearchableSelect-Control-is-selected'));
					assert(controlWrapper.hasClass('lucid-SearchableSelect-Control-is-highlighted'));
				});
			});

			describe('false', () => {
				it('should apply the appropriate classNames to the control', () => {
					const wrapper = shallow(
						<SearchableSelect
							isSelectionHighlighted={false}
							selectedIndex={2}
							>
							<Placeholder>select one</Placeholder>
							<Option>option a</Option>
							<Option>option b</Option>
							<Option>option c</Option>
						</SearchableSelect>
					);
					const controlWrapper = wrapper.find('.lucid-SearchableSelect-Control');
					assert(!controlWrapper.hasClass('lucid-SearchableSelect-Control-is-selected'));
					assert(!controlWrapper.hasClass('lucid-SearchableSelect-Control-is-highlighted'));
				});
			});
		});

		describe('selectedIndex', () => {
			it('should pass the selectedIndex in an array of 1 to the underlying DropMenu', () => {
				const wrapper = shallow(
					<SearchableSelect selectedIndex={2}>
						<Placeholder>select one</Placeholder>
						<Option>option a</Option>
						<Option>option b</Option>
						<Option>option c</Option>
					</SearchableSelect>
				);

				const dropMenuWrapper = wrapper.find('DropMenu');

				assert(_.isEqual(dropMenuWrapper.prop('selectedIndices'), [2]));
			});

			it('should render selected option in the control', () => {
				const wrapper = shallow(
					<SearchableSelect selectedIndex={2}>
						<Placeholder>select one</Placeholder>
						<Option>option a</Option>
						<Option>option b</Option>
						<Option>option c</Option>
					</SearchableSelect>
				);

				const dropMenuControlWrapper = wrapper.find('DropMenu').childAt(0);

				assert.equal('option c', dropMenuControlWrapper.find('.lucid-SearchableSelect-Control-content').text());
			});
		});

		describe('maxMenuHeight', () => {
			it('should pass through to DropMenu prop `optionContainerStyle.maxHeight`', () => {
				const wrapper = shallow(
					<SearchableSelect maxMenuHeight={123}>
						<Placeholder>select one</Placeholder>
						<Option>option a</Option>
						<Option>option b</Option>
						<Option>option c</Option>
					</SearchableSelect>
				);

				const dropMenuWrapper = wrapper.find(DropMenu);
				const optionContainerStyle = dropMenuWrapper.prop('optionContainerStyle')
				assert.equal(123, optionContainerStyle.maxHeight, 'must match prop value');
			});
		});

		describe('onSelect', () => {
			let wrapper;

			afterEach(() => {
				if (wrapper) {
					wrapper.unmount();
				}
			});


			it('should be called when an option is selected with the appropriate arguments', () => {
				const onSelect = sinon.spy();

				wrapper = mount(
					<SearchableSelect onSelect={onSelect} DropMenu={{ isExpanded: true }}>
						<Placeholder>select one</Placeholder>
						<Option>option a</Option>
						<Option>option b</Option>
						<Option testProp='foo'>option c</Option>
					</SearchableSelect>
				);

				const menuDOMNode = document.querySelector('.lucid-ContextMenu-FlyOut .lucid-DropMenu-option-container');
				menuDOMNode.children[2].click();

				assert(onSelect.called);
				const [optionIndex, { props, event }] = onSelect.lastCall.args;
				assert.equal(optionIndex, 2);
				assert(props);
				assert.equal(props.testProp, 'foo');
				assert(event);
			});
		});

		describe('onSearch', () => {
			it('should be called when a new value is entered into the search input', () => {
				const onSearch = sinon.spy();

				const wrapper = shallow(
					<SearchableSelect onSearch={onSearch} DropMenu={{ isExpanded: true }}>
						<Placeholder>select one</Placeholder>
						<Option>option a</Option>
						<Option>option b</Option>
						<Option testProp='foo'>option c</Option>
					</SearchableSelect>
				);

				const searchFieldWrapper = wrapper.find(SearchField);

				searchFieldWrapper.simulate('change', 'asdf', {event: {}});
				assert(onSearch.calledWith('asdf'));
			});
		});

		describe('DropMenu', () => {
			it('should pass thru all DropMenu props to the underlying DropMenu', () => {
				const explicitDropMenuProps = {
					isExpanded: true,
					direction: 'up',
					focusedIndex: 2,
				};

				const wrapper = shallow(
					<SearchableSelect DropMenu={explicitDropMenuProps}>
						<Placeholder>control</Placeholder>
						<Option>option a</Option>
						<Option>option b</Option>
						<Option>option c</Option>
					</SearchableSelect>
				);

				const dropMenuProps = wrapper.find('DropMenu').props();

				_.forEach(explicitDropMenuProps, (value, key) => {
					assert(_.isEqual(dropMenuProps[key], value));
				});
			});
		});

	});

	describe('child elements', () => {
		describe('SearchField', () => {
			it('should pass the searchfield props through to the underlying SearchField element', () => {
				const wrapper = shallow(
					<SearchableSelect DropMenu={{isExpanded: true}}>
						<SearchField placeholder='custom' />
						<Option name='OptionA'>option a</Option>
						<Option name='OptionB'>option b</Option>
						<Option name='OptionC'>option c</Option>
					</SearchableSelect>
				);

				const dropMenuHeader = wrapper.childAt(1);
				const searchFieldWrapper = dropMenuHeader.childAt(0);

				assert.equal(searchFieldWrapper.prop('placeholder'), 'custom');
			});
		});

		describe('Placeholder', () => {
			it('should pass the placeholder thru to the underlying DropMenu Control when no option is selected', () => {
				const wrapper = shallow(
					<SearchableSelect selectedIndex={null}>
						<Placeholder>select one</Placeholder>
						<Option name='OptionA'>option a</Option>
						<Option name='OptionB'>option b</Option>
						<Option name='OptionC'>option c</Option>
					</SearchableSelect>
				);

				// navigate down the virutal DOM tree to find the Control content
				const dropMenuWrapper = wrapper.find('DropMenu');
				const dropMenuChildren = dropMenuWrapper.prop('children')
				const controlProps = _.first(_.map(filterTypes(dropMenuChildren, DropMenu.Control), 'props'));
				const dropMenuControlChildElement = _.first(React.Children.toArray(controlProps.children));
				const SearchableSelectControlChildren = React.Children.toArray(dropMenuControlChildElement.props.children);
				const SearchableSelectControlContent = SearchableSelectControlChildren[0];

				assert.equal(React.Children.toArray(SearchableSelectControlContent.props.children)[0], 'select one');
			});

			it('should pass the placeholder thru to the underlying DropMenu NullOption when an option is selected', () => {
				const wrapper = shallow(
					<SearchableSelect selectedIndex={1}>
						<Placeholder>select one</Placeholder>
						<Option name='OptionA'>option a</Option>
						<Option name='OptionB'>option b</Option>
						<Option name='OptionC'>option c</Option>
					</SearchableSelect>
				);

				// navigate down the virutal DOM tree to find the Control content
				const dropMenuWrapper = wrapper.find('DropMenu');
				const dropMenuChildren = dropMenuWrapper.prop('children')
				const nullOptionProps = _.first(_.map(filterTypes(dropMenuChildren, DropMenu.NullOption), 'props'));

				assert.equal(React.Children.toArray(nullOptionProps.children)[0], 'select one');
			});
		});

		describe('Option', () => {
			it('should pass options thru to the underlying DropMenu', () => {
				const wrapper = shallow(
					<SearchableSelect>
						<Placeholder>select one</Placeholder>
						<Option name='OptionA'>option a</Option>
						<Option name='OptionB'>option b</Option>
						<Option name='OptionC'>option c</Option>
					</SearchableSelect>
				);

				const dropMenuWrapper = wrapper.find('DropMenu');
				const dropMenuChildren = dropMenuWrapper.prop('children')
				const optionsProps = _.map(filterTypes(dropMenuChildren, DropMenu.Option), 'props');

				assert.equal(_.size(optionsProps), 3);
				assert(_.isEqual(optionsProps[0], {
					name: 'OptionA',
					children: 'option a',
					isDisabled: false,
				}));
				assert(_.isEqual(optionsProps[1], {
					name: 'OptionB',
					children: 'option b',
					isDisabled: false,
				}));
				assert(_.isEqual(optionsProps[2], {
					name: 'OptionC',
					children: 'option c',
					isDisabled: false,
				}));
			});
		});

		describe('OptionGroup', () => {
			let wrapper;
			let dropMenuWrapper;
			let dropMenuChildren;
			let optionGroupProps;

			beforeEach(() => {
				wrapper = shallow(
					<SearchableSelect>
						<Placeholder>select one</Placeholder>
						<OptionGroup name='TestGroup'>
							Group Label
							<Option name='OptionA'>option a</Option>
							<Option name='OptionB'>option b</Option>
							<Option name='OptionC'>option c</Option>
						</OptionGroup>
					</SearchableSelect>
				);

				dropMenuWrapper = wrapper.find('DropMenu');
				dropMenuChildren = dropMenuWrapper.prop('children')
				optionGroupProps = _.first(_.map(filterTypes(dropMenuChildren, DropMenu.OptionGroup), 'props'));
			});

			it('should pass thru all props to the underlying DropMenu OptionGroup', () => {
				assert.equal(optionGroupProps.name, 'TestGroup');
			});

			it('should pass options thru to the underlying DropMenu OptionGroup Options', () => {
				const optionsProps = _.map(filterTypes(optionGroupProps.children, DropMenu.Option), 'props');

				assert.equal(_.size(optionsProps), 3);
				assert(_.isEqual(optionsProps[0], {
					name: 'OptionA',
					children: 'option a',
					isDisabled: false,
				}));
				assert(_.isEqual(optionsProps[1], {
					name: 'OptionB',
					children: 'option b',
					isDisabled: false,
				}));
				assert(_.isEqual(optionsProps[2], {
					name: 'OptionC',
					children: 'option c',
					isDisabled: false,
				}));

			});

			it('should pass all other elemens thru to the underlying DropMenu OptionGroup', () => {
				const otherOptionGroupChildren = rejectTypes(optionGroupProps.children, [Placeholder, Option, OptionGroup]);

				assert.equal(_.first(otherOptionGroupChildren), 'Group Label');
			});
		});
	});

	describe('statics', () => {
		describe('#getCombinedChildText', () => {
			it('should return \'\' if the passed in node has no children', () => {
				assert.equal(SearchableSelect.getCombinedChildText({}), '');
			});

			it('should return the node\'s `children` if it is a string', () => {
				const children = 'child';
				assert.equal(SearchableSelect.getCombinedChildText({children}), 'child');
			});

			it('should recursively combine children', () => {
				const node = {children: [{props: {children: '1'}}, {props: {children: [{props: {children: '2'}}, {props: {children: '3'}}]}}]}
				assert.equal(SearchableSelect.getCombinedChildText(node), '123');
			});
		});

		describe('#defaultOptionFilter', () => {
			it('should return true if the searchText is undefined', () => {
				assert(SearchableSelect.defaultOptionFilter());
			});

			it('should return true if the searchText is null', () => {
				assert(SearchableSelect.defaultOptionFilter(null));
			});

			it('should return true if the searchText is empty string', () => {
				assert(SearchableSelect.defaultOptionFilter(''));
			});

			it('should return true if the searchText matches the option\'s text', () => {
				assert(SearchableSelect.defaultOptionFilter('search', {children: 'search'}));
			});

			it('should return false if the searchText does not match the option\'s text', () => {
				assert(!SearchableSelect.defaultOptionFilter('search', {children: 'miss'}));
			});
		});
	});
});
