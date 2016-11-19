/// <reference path="../factory.ts" />
/// <reference path="../visitor.ts" />

/*@internal*/
namespace ts {
    //const brackets = createBracketsMap();

    export function transformScala(context: TransformationContext) {
        const { } = context;

        return transformSourceFile;

        function transformSourceFile(node: SourceFile) {
            emitScala(node);
            return node;
        }

        function emitScala(node: SourceFile) {
            const targetFileName = node.fileName + ".scala";
            const emitterDiagnostics = createDiagnosticCollection();
            const host = context.getEmitHost();
            //const resolver = context.getEmitResolver();
            const writer = createTextWriter(host.getNewLine());

            emitNode(writer, node);
            console.log("emitting scala!");
            
            // Write the output file
            writeFile(host, emitterDiagnostics, targetFileName, writer.getText(), false);
        }

        function emitNode(writer: EmitTextWriter, node: Node): void {
            const {
                write,
                writeLine
            } = writer;

            console.log(node.kind);

            emit(node);

            function emitTokenText(kind: SyntaxKind): void {
                write(tokenToString(kind));
            }

            function emitSourceFile(node: SourceFile): void {
                console.log("In emitSourceFile()");
                //emitBodyWithDetachedComments(node, node.statements, emitSourceFileWorker);
            //}
                
            //function emitSourceFileWorker(node: SourceFile) {
                console.log("In emitSourceFileWorker()");
                const statements = node.statements;
                console.log("statement: " + statements);
                const statementOffset = emitPrologueDirectives(statements);
                ///const savedTempFlags = tempFlags;
                //tempFlags = 0;
                //emitHelpers(node);
                for (let i = statementOffset; i < statements.length; ++i) {
                    emit(statements[i]);
                    writeLine();
                }
                //emitList(node, statements, ListFormat.MultiLine, statementOffset);
                //tempFlags = savedTempFlags;
            }

            /**
             * Emits any prologue directives at the start of a Statement list, returning the
             * number of prologue directives written to the output.
             */
            function emitPrologueDirectives(statements: Node[]): number {
                for (let i = 0; i < statements.length; i++) {
                    if (isPrologueDirective(statements[i])) {
                        /*if (startWithNewLine || i > 0) {
                            writeLine();
                        }
                        emit(statements[i]);*/
                    }
                    else {
                        // return index of the first non prologue directive
                        return i;
                    }
                }

                return statements.length;
            }

            function emitParameter(node: ParameterDeclaration): void { const { } = node; }
            function emitLiteral(node: LiteralExpression): void { const { } = node; }

            function emitIdentifier(node: Identifier): void {
                write(node.text);
            }

            function emitQualifiedName(node: QualifiedName): void  { const { } = node; } 
            function emitComputedPropertyName(node: ComputedPropertyName): void { const { } = node; }
            function emitTypeParameter(node: TypeParameterDeclaration): void { const { } = node; }
            function emitDecorator(node: Decorator): void { const { } = node; }
            function emitPropertySignature(node: PropertySignature): void { const { } = node; }
            function emitPropertyDeclaration(node: PropertyDeclaration): void { const { } = node; }
            function emitMethodSignature(node: MethodSignature): void { const { } = node; }
            function emitMethodDeclaration(node: MethodDeclaration): void { const { } = node; }
            function emitConstructor(node: ConstructorDeclaration): void { const { } = node; }
            function emitAccessorDeclaration(node: AccessorDeclaration): void { const { } = node; }
            function emitCallSignature(node: CallSignatureDeclaration): void { const { } = node; }
            function emitConstructSignature(node: ConstructSignatureDeclaration): void { const { } = node; }
            function emitIndexSignature(node: IndexSignatureDeclaration): void { const { } = node; }
            function emitTypePredicate(node: TypePredicateNode): void { const { } = node; }
            function emitTypeReference(node: TypeReferenceNode): void { const { } = node; }
            function emitFunctionType(node: FunctionTypeNode): void { const { } = node; }
            function emitConstructorType(node: ConstructorTypeNode): void { const { } = node; }
            function emitTypeQuery(node: TypeQueryNode): void { const { } = node; }
            function emitTypeLiteral(node: TypeLiteralNode): void { const { } = node; }
            function emitArrayType(node: ArrayTypeNode): void { const { } = node; }
            function emitTupleType(node: TupleTypeNode): void { const { } = node; }
            function emitUnionType(node: UnionTypeNode): void { const { } = node; }
            function emitIntersectionType(node: IntersectionTypeNode): void { const { } = node; }
            function emitParenthesizedType(node: ParenthesizedTypeNode): void { const { } = node; }
            function emitExpressionWithTypeArguments(node: ExpressionWithTypeArguments): void { const { } = node; }
            function emitThisType(): void { const { } = node; }
            function emitLiteralType(node: LiteralTypeNode): void { const { } = node; }
            function emitObjectBindingPattern(node: ObjectBindingPattern): void { const { } = node; }
            function emitArrayBindingPattern(node: ArrayBindingPattern): void { const { } = node; }
            function emitBindingElement(node: BindingElement): void { const { } = node; }
            function emitTemplateSpan(node: TemplateSpan): void { const { } = node; }
            function emitSemicolonClassElement(): void { const { } = node; }
            
            function emitBlock(node: Block): void {   
                if (isSingleLineEmptyBlock(node)) {
                    emitTokenText(SyntaxKind.OpenBraceToken);
                    write(" ");
                    emitTokenText(SyntaxKind.CloseBraceToken);
                }
                else {
                    emitTokenText(SyntaxKind.OpenBraceToken);
                    emitBlockStatements(node);
                    emitTokenText(SyntaxKind.CloseBraceToken);
                }
            }

            function emitBlockStatements(node: BlockLike) {
                if (getEmitFlags(node) & EmitFlags.SingleLine) {
                    emitList(node.statements, ListFormat.SingleLineBlockStatements);
                }
                else {
                    emitList(node.statements, ListFormat.MultiLineBlockStatements);
                }
            }

            function emitVariableStatement(node: VariableStatement): void { const { } = node; }
            function emitEmptyStatement(): void { const { } = node; }

            function emitExpressionStatement(node: ExpressionStatement): void {
                const { } = node;
                console.log("emitExpressionStatement");
            }

            function emitIfStatement(node: IfStatement): void {
                emitTokenText(SyntaxKind.IfKeyword);
                console.log("emitting if statement!");
                write(" ");
                emitTokenText(SyntaxKind.OpenParenToken);
                emitExpression(node.expression);
                emitTokenText(SyntaxKind.CloseParenToken);
                emitEmbeddedStatement(node.thenStatement);
                if (node.elseStatement) {
                    writeLine();
                    emitTokenText(SyntaxKind.ElseKeyword);
                    if (node.elseStatement.kind === SyntaxKind.IfStatement) {
                        write(" ");
                        emit(node.elseStatement);
                    }
                    else {
                        emitEmbeddedStatement(node.elseStatement);
                    }
                }
           }

           function emitEmbeddedStatement(node: Statement) {
                if (isBlock(node)) {
                    write(" ");
                    emit(node);
                }
                else {
                    writeLine();
                    emit(node);
                }
            }
            
            function emitDoStatement(node: DoStatement): void { const { } = node; }
            function emitWhileStatement(node: WhileStatement): void { const { } = node; }
            function emitForStatement(node: ForStatement): void { const { } = node; }
            function emitForInStatement(node: ForInStatement): void { const { } = node; }
            function emitForOfStatement(node: ForOfStatement): void { const { } = node; }
            function emitContinueStatement(node: ContinueStatement): void { const { } = node; }
            function emitBreakStatement(node: BreakStatement): void { const { } = node; }
            function emitReturnStatement(node: ReturnStatement): void { const { } = node; }
            function emitWithStatement(node: WithStatement): void { const { } = node; }
            function emitSwitchStatement(node: SwitchStatement): void { const { } = node; }
            function emitLabeledStatement(node: LabeledStatement): void { const { } = node; }
            function emitThrowStatement(node: ThrowStatement): void { const { } = node; }
            function emitTryStatement(node: TryStatement): void { const { } = node; }
            function emitDebuggerStatement(node: DebuggerStatement): void { const { } = node; }
            function emitVariableDeclaration(node: VariableDeclaration): void { const { } = node; }
            function emitVariableDeclarationList(node: VariableDeclarationList): void { const { } = node; }

            function emitFunctionDeclaration(node: FunctionDeclaration): void {
                write("def ");
                emit(node.name);
                emitSignature(node);
                emitTypeResult(node.type);
                if (node.body)
                    emit(node.body);
                writeLine();
            }

            function emitSignature(node: SignatureDeclaration): void {
                //emitTypeParameters(node.typeParameters);
                emitParameterList(node.parameters);
            }

            function emitParameterList(parameters: NodeArray<ParameterDeclaration>): void {
                write("(");
                let first = true;
                for (const param of parameters) {
                    if (first)
                        first = false;
                    else
                        write(", ");
                    emit(param.name);
                    emitTypeResult(param.type);
                    if (param.initializer) {
                        write(" = ");
                        emit(param.initializer);
                    }
                }
                write(")");
            }

            function emitTypeResult(type?: TypeNode): void {
                write(": ");
                if (type)
                    emit(type);
                else
                    write("Any");
            }

            function emitClassDeclaration(node: ClassDeclaration): void { const { } = node; }

            function emitInterfaceDeclaration(node: InterfaceDeclaration): void {
                const { } = node;
                write("trait ");
                emit(node.name);
                //emitTypeParameters(node.typeParameters);
                write("{");
                writeLine();
                write("}");
                writeLine();
            }

            function emitTypeAliasDeclaration(node: TypeAliasDeclaration): void { const { } = node; }
            function emitEnumDeclaration(node: EnumDeclaration): void { const { } = node; }

            function emitModuleDeclaration(node: ModuleDeclaration): void {
                const { } = node;
                console.log("emitModuleDeclaration");
                write("package ");
                //console.log(node.name);
                emit(node.name);
                write(" {");
                writeLine();
                //console.log(node.body);
                emit(node.body);
                write("}");
                writeLine();
            }

            function emitModuleBlock(node: ModuleBlock): void {
                const { } = node;
                for (const stat of node.statements)
                    emit(stat);
            }

            function emitCaseBlock(node: CaseBlock): void { const { } = node; }
            function emitImportEqualsDeclaration(node: ImportEqualsDeclaration): void { const { } = node; }
            function emitImportDeclaration(node: ImportDeclaration): void { const { } = node; }
            function emitImportClause(node: ImportClause): void { const { } = node; }
            function emitNamespaceImport(node: NamespaceImport): void { const { } = node; }
            function emitNamedImports(node: NamedImports): void { const { } = node; }
            function emitImportSpecifier(node: ImportSpecifier): void { const { } = node; }
            function emitExportAssignment(node: ExportAssignment): void { const { } = node; }
            function emitExportDeclaration(node: ExportDeclaration): void { const { } = node; }
            function emitNamedExports(node: NamedExports): void { const { } = node; }
            function emitExportSpecifier(node: ExportSpecifier): void { const { } = node; }
            function emitCaseClause(node: CaseClause): void { const { } = node; } 
            function emitDefaultClause(node: DefaultClause): void { const { } = node; }
            function emitHeritageClause(node: HeritageClause): void { const { } = node; }
            function emitCatchClause(node: CatchClause): void { const { } = node; }
            function emitPropertyAssignment(node: PropertyAssignment): void { const { } = node; }
            function emitShorthandPropertyAssignment(node: ShorthandPropertyAssignment): void { const { } = node; }
            function emitEnumMember(node: EnumMember): void { const { } = node; }
            function emitExternalModuleReference(node: ExternalModuleReference): void { const { } = node; }
            function emitArrayLiteralExpression(node: ArrayLiteralExpression): void { const { } = node; }
            function emitObjectLiteralExpression(node: ObjectLiteralExpression): void { const { } = node; }
            
            function emitPropertyAccessExpression(node: PropertyAccessExpression): void {
                emitExpression(node.expression);
                write(".");
                emit(node.name);
            }
            
            function emitElementAccessExpression(node: ElementAccessExpression): void { const { } = node; }
            function emitCallExpression(node: CallExpression): void { const { } = node; }
            function emitNewExpression(node: NewExpression): void { const { } = node; }
            function emitTaggedTemplateExpression(node: TaggedTemplateExpression): void { const { } = node; }
            function emitTypeAssertionExpression(node: TypeAssertion): void { const { } = node; }
            function emitParenthesizedExpression(node: ParenthesizedExpression): void { const { } = node; }
            function emitFunctionExpression(node: FunctionExpression): void { const { } = node; }
            function emitArrowFunction(node: ArrowFunction): void { const { } = node; }
            function emitDeleteExpression(node: DeleteExpression): void { const { } = node; }
            function emitTypeOfExpression(node: TypeOfExpression): void { const { } = node; }
            function emitVoidExpression(node: VoidExpression): void { const { } = node; }
            function emitAwaitExpression(node: AwaitExpression): void { const { } = node; }
            function emitPrefixUnaryExpression(node: PrefixUnaryExpression): void { const { } = node; }
            function emitPostfixUnaryExpression(node: PostfixUnaryExpression): void { const { } = node; }
            
            function emitBinaryExpression(node: BinaryExpression): void { 
                emitExpression(node.left);
                emitTokenText(node.operatorToken.kind);
                emitExpression(node.right);
            }

            function emitConditionalExpression(node: ConditionalExpression): void { const { } = node; }
            function emitTemplateExpression(node: TemplateExpression): void { const { } = node; }
            function emitYieldExpression(node: YieldExpression): void { const { } = node; }
            function emitSpreadElementExpression(node: SpreadElementExpression): void { const { } = node; }
            function emitClassExpression(node: ClassExpression): void { const { } = node; }
            function emitAsExpression(node: AsExpression): void { const { } = node; }
            function emitNonNullExpression(node: NonNullExpression): void { const { } = node; }

            function emitList(children: NodeArray<Node>, format: ListFormat, start?: number, count?: number) {
                emitNodeList(emit, children, format, start, count);
            }

            /*function emitExpressionList(parentNode: Node, children: NodeArray<Node>, format: ListFormat, start?: number, count?: number) {
                emitNodeList(emitExpression, parentNode, children, format, start, count);
            }*/

            function emitExpression(node: Node): void { emit(node); }

            function emitNodeList(emit: (node: Node) => void, children: NodeArray<Node>, format: ListFormat, start = 0, count = children ? children.length - start : 0) {
                const isUndefined = children === undefined;
                if (isUndefined && format & ListFormat.OptionalIfUndefined) {
                    return;
                }

                const isEmpty = isUndefined || children.length === 0 || start >= children.length || count === 0;
                if (isEmpty && format & ListFormat.OptionalIfEmpty) {
                    return;
                }

                if (format & ListFormat.BracketsMask) {
                    write(getOpeningBracket(format));
                }

                if (isEmpty) {
                    // Write a line terminator if the parent node was multi-line
                    if (format & ListFormat.MultiLine) {
                        writeLine();
                    }
                    else if (format & ListFormat.SpaceBetweenBraces) {
                        write(" ");
                    }
                }
                else {
                    write(" ");
                    // Emit each child.
                    let previousSibling: Node;
                    const delimiter = getDelimiter(format);
                    for (let i = 0; i < count; i++) {
                        const child = children[start + i];

                        // Write the delimiter if this is not the first node.
                        if (previousSibling) {
                            write(delimiter);
                            write(" ");
                        }

                        // Emit this child.
                        emit(child);

                        previousSibling = child;
                    }

                    // Write a trailing comma, if requested.
                    const hasTrailingComma = (format & ListFormat.AllowTrailingComma) && children.hasTrailingComma;
                    if (format & ListFormat.CommaDelimited && hasTrailingComma) {
                        write(",");
                    }


                    // Write the closing line terminator or closing whitespace.
                    write(" ");
                }

                if (format & ListFormat.BracketsMask) {
                    write(getClosingBracket(format));
                }
            }

            function emit(node: Node): void {
                console.log("emitting node kind " + node.kind);
                switch (node.kind) {
                    // SourceFile
                    case SyntaxKind.SourceFile:
                        return emitSourceFile(<SourceFile>node);

                    // Pseudo-literals
                    case SyntaxKind.TemplateHead:
                    case SyntaxKind.TemplateMiddle:
                    case SyntaxKind.TemplateTail:
                        return emitLiteral(<LiteralExpression>node);

                    // Identifiers
                    case SyntaxKind.Identifier:
                        return emitIdentifier(<Identifier>node);

                    // Reserved words
                    case SyntaxKind.ConstKeyword:
                    case SyntaxKind.DefaultKeyword:
                    case SyntaxKind.ExportKeyword:
                    case SyntaxKind.VoidKeyword:

                    // Strict mode reserved words
                    case SyntaxKind.PrivateKeyword:
                    case SyntaxKind.ProtectedKeyword:
                    case SyntaxKind.PublicKeyword:
                    case SyntaxKind.StaticKeyword:

                    // Contextual keywords
                    case SyntaxKind.AbstractKeyword:
                    case SyntaxKind.AsKeyword:
                    case SyntaxKind.AnyKeyword:
                    case SyntaxKind.AsyncKeyword:
                    case SyntaxKind.AwaitKeyword:
                    case SyntaxKind.BooleanKeyword:
                    case SyntaxKind.ConstructorKeyword:
                    case SyntaxKind.DeclareKeyword:
                    case SyntaxKind.GetKeyword:
                    case SyntaxKind.IsKeyword:
                    case SyntaxKind.ModuleKeyword:
                    case SyntaxKind.NamespaceKeyword:
                    case SyntaxKind.NeverKeyword:
                    case SyntaxKind.ReadonlyKeyword:
                    case SyntaxKind.RequireKeyword:
                    case SyntaxKind.NumberKeyword:
                    case SyntaxKind.SetKeyword:
                    case SyntaxKind.StringKeyword:
                    case SyntaxKind.SymbolKeyword:
                    case SyntaxKind.TypeKeyword:
                    case SyntaxKind.UndefinedKeyword:
                    case SyntaxKind.FromKeyword:
                    case SyntaxKind.GlobalKeyword:
                    case SyntaxKind.OfKeyword:
                        emitTokenText(node.kind);
                        return;

                    // Parse tree nodes

                    // Names
                    case SyntaxKind.QualifiedName:
                        return emitQualifiedName(<QualifiedName>node);
                    case SyntaxKind.ComputedPropertyName:
                        return emitComputedPropertyName(<ComputedPropertyName>node);

                    // Signature elements
                    case SyntaxKind.TypeParameter:
                        return emitTypeParameter(<TypeParameterDeclaration>node);
                    case SyntaxKind.Parameter:
                        return emitParameter(<ParameterDeclaration>node);
                    case SyntaxKind.Decorator:
                        return emitDecorator(<Decorator>node);

                    // Type members
                    case SyntaxKind.PropertySignature:
                        return emitPropertySignature(<PropertySignature>node);
                    case SyntaxKind.PropertyDeclaration:
                        return emitPropertyDeclaration(<PropertyDeclaration>node);
                    case SyntaxKind.MethodSignature:
                        return emitMethodSignature(<MethodSignature>node);
                    case SyntaxKind.MethodDeclaration:
                        return emitMethodDeclaration(<MethodDeclaration>node);
                    case SyntaxKind.Constructor:
                        return emitConstructor(<ConstructorDeclaration>node);
                    case SyntaxKind.GetAccessor:
                    case SyntaxKind.SetAccessor:
                        return emitAccessorDeclaration(<AccessorDeclaration>node);
                    case SyntaxKind.CallSignature:
                        return emitCallSignature(<CallSignatureDeclaration>node);
                    case SyntaxKind.ConstructSignature:
                        return emitConstructSignature(<ConstructSignatureDeclaration>node);
                    case SyntaxKind.IndexSignature:
                        return emitIndexSignature(<IndexSignatureDeclaration>node);

                    // Types
                    case SyntaxKind.TypePredicate:
                        return emitTypePredicate(<TypePredicateNode>node);
                    case SyntaxKind.TypeReference:
                        return emitTypeReference(<TypeReferenceNode>node);
                    case SyntaxKind.FunctionType:
                        return emitFunctionType(<FunctionTypeNode>node);
                    case SyntaxKind.ConstructorType:
                        return emitConstructorType(<ConstructorTypeNode>node);
                    case SyntaxKind.TypeQuery:
                        return emitTypeQuery(<TypeQueryNode>node);
                    case SyntaxKind.TypeLiteral:
                        return emitTypeLiteral(<TypeLiteralNode>node);
                    case SyntaxKind.ArrayType:
                        return emitArrayType(<ArrayTypeNode>node);
                    case SyntaxKind.TupleType:
                        return emitTupleType(<TupleTypeNode>node);
                    case SyntaxKind.UnionType:
                        return emitUnionType(<UnionTypeNode>node);
                    case SyntaxKind.IntersectionType:
                        return emitIntersectionType(<IntersectionTypeNode>node);
                    case SyntaxKind.ParenthesizedType:
                        return emitParenthesizedType(<ParenthesizedTypeNode>node);
                    case SyntaxKind.ExpressionWithTypeArguments:
                        return emitExpressionWithTypeArguments(<ExpressionWithTypeArguments>node);
                    case SyntaxKind.ThisType:
                        return emitThisType();
                    case SyntaxKind.LiteralType:
                        return emitLiteralType(<LiteralTypeNode>node);

                    // Binding patterns
                    case SyntaxKind.ObjectBindingPattern:
                        return emitObjectBindingPattern(<ObjectBindingPattern>node);
                    case SyntaxKind.ArrayBindingPattern:
                        return emitArrayBindingPattern(<ArrayBindingPattern>node);
                    case SyntaxKind.BindingElement:
                        return emitBindingElement(<BindingElement>node);

                    // Misc
                    case SyntaxKind.TemplateSpan:
                        return emitTemplateSpan(<TemplateSpan>node);
                    case SyntaxKind.SemicolonClassElement:
                        return emitSemicolonClassElement();

                    // Statements
                    case SyntaxKind.Block:
                        return emitBlock(<Block>node);
                    case SyntaxKind.VariableStatement:
                        return emitVariableStatement(<VariableStatement>node);
                    case SyntaxKind.EmptyStatement:
                        return emitEmptyStatement();
                    case SyntaxKind.ExpressionStatement:
                        return emitExpressionStatement(<ExpressionStatement>node);
                    case SyntaxKind.IfStatement:
                        return emitIfStatement(<IfStatement>node);
                    case SyntaxKind.DoStatement:
                        return emitDoStatement(<DoStatement>node);
                    case SyntaxKind.WhileStatement:
                        return emitWhileStatement(<WhileStatement>node);
                    case SyntaxKind.ForStatement:
                        return emitForStatement(<ForStatement>node);
                    case SyntaxKind.ForInStatement:
                        return emitForInStatement(<ForInStatement>node);
                    case SyntaxKind.ForOfStatement:
                        return emitForOfStatement(<ForOfStatement>node);
                    case SyntaxKind.ContinueStatement:
                        return emitContinueStatement(<ContinueStatement>node);
                    case SyntaxKind.BreakStatement:
                        return emitBreakStatement(<BreakStatement>node);
                    case SyntaxKind.ReturnStatement:
                        return emitReturnStatement(<ReturnStatement>node);
                    case SyntaxKind.WithStatement:
                        return emitWithStatement(<WithStatement>node);
                    case SyntaxKind.SwitchStatement:
                        return emitSwitchStatement(<SwitchStatement>node);
                    case SyntaxKind.LabeledStatement:
                        return emitLabeledStatement(<LabeledStatement>node);
                    case SyntaxKind.ThrowStatement:
                        return emitThrowStatement(<ThrowStatement>node);
                    case SyntaxKind.TryStatement:
                        return emitTryStatement(<TryStatement>node);
                    case SyntaxKind.DebuggerStatement:
                        return emitDebuggerStatement(<DebuggerStatement>node);

                    // Declarations
                    case SyntaxKind.VariableDeclaration:
                        return emitVariableDeclaration(<VariableDeclaration>node);
                    case SyntaxKind.VariableDeclarationList:
                        return emitVariableDeclarationList(<VariableDeclarationList>node);
                    case SyntaxKind.FunctionDeclaration:
                        return emitFunctionDeclaration(<FunctionDeclaration>node);
                    case SyntaxKind.ClassDeclaration:
                        return emitClassDeclaration(<ClassDeclaration>node);
                    case SyntaxKind.InterfaceDeclaration:
                        return emitInterfaceDeclaration(<InterfaceDeclaration>node);
                    case SyntaxKind.TypeAliasDeclaration:
                        return emitTypeAliasDeclaration(<TypeAliasDeclaration>node);
                    case SyntaxKind.EnumDeclaration:
                        return emitEnumDeclaration(<EnumDeclaration>node);
                    case SyntaxKind.ModuleDeclaration:
                        return emitModuleDeclaration(<ModuleDeclaration>node);
                    case SyntaxKind.ModuleBlock:
                        return emitModuleBlock(<ModuleBlock>node);
                    case SyntaxKind.CaseBlock:
                        return emitCaseBlock(<CaseBlock>node);
                    case SyntaxKind.ImportEqualsDeclaration:
                        return emitImportEqualsDeclaration(<ImportEqualsDeclaration>node);
                    case SyntaxKind.ImportDeclaration:
                        return emitImportDeclaration(<ImportDeclaration>node);
                    case SyntaxKind.ImportClause:
                        return emitImportClause(<ImportClause>node);
                    case SyntaxKind.NamespaceImport:
                        return emitNamespaceImport(<NamespaceImport>node);
                    case SyntaxKind.NamedImports:
                        return emitNamedImports(<NamedImports>node);
                    case SyntaxKind.ImportSpecifier:
                        return emitImportSpecifier(<ImportSpecifier>node);
                    case SyntaxKind.ExportAssignment:
                        return emitExportAssignment(<ExportAssignment>node);
                    case SyntaxKind.ExportDeclaration:
                        return emitExportDeclaration(<ExportDeclaration>node);
                    case SyntaxKind.NamedExports:
                        return emitNamedExports(<NamedExports>node);
                    case SyntaxKind.ExportSpecifier:
                        return emitExportSpecifier(<ExportSpecifier>node);
                    case SyntaxKind.MissingDeclaration:
                        return;

                    // Module references
                    case SyntaxKind.ExternalModuleReference:
                        return emitExternalModuleReference(<ExternalModuleReference>node);

                    // Expressions
                    case SyntaxKind.ArrayLiteralExpression:
                        return emitArrayLiteralExpression(<ArrayLiteralExpression>node);
                    case SyntaxKind.ObjectLiteralExpression:
                        return emitObjectLiteralExpression(<ObjectLiteralExpression>node);
                    case SyntaxKind.PropertyAccessExpression:
                        return emitPropertyAccessExpression(<PropertyAccessExpression>node);
                    case SyntaxKind.ElementAccessExpression:
                        return emitElementAccessExpression(<ElementAccessExpression>node);
                    case SyntaxKind.CallExpression:
                        return emitCallExpression(<CallExpression>node);
                    case SyntaxKind.NewExpression:
                        return emitNewExpression(<NewExpression>node);
                    case SyntaxKind.TaggedTemplateExpression:
                        return emitTaggedTemplateExpression(<TaggedTemplateExpression>node);
                    case SyntaxKind.TypeAssertionExpression:
                        return emitTypeAssertionExpression(<TypeAssertion>node);
                    case SyntaxKind.ParenthesizedExpression:
                        return emitParenthesizedExpression(<ParenthesizedExpression>node);
                    case SyntaxKind.FunctionExpression:
                        return emitFunctionExpression(<FunctionExpression>node);
                    case SyntaxKind.ArrowFunction:
                        return emitArrowFunction(<ArrowFunction>node);
                    case SyntaxKind.DeleteExpression:
                        return emitDeleteExpression(<DeleteExpression>node);
                    case SyntaxKind.TypeOfExpression:
                        return emitTypeOfExpression(<TypeOfExpression>node);
                    case SyntaxKind.VoidExpression:
                        return emitVoidExpression(<VoidExpression>node);
                    case SyntaxKind.AwaitExpression:
                        return emitAwaitExpression(<AwaitExpression>node);
                    case SyntaxKind.PrefixUnaryExpression:
                        return emitPrefixUnaryExpression(<PrefixUnaryExpression>node);
                    case SyntaxKind.PostfixUnaryExpression:
                        return emitPostfixUnaryExpression(<PostfixUnaryExpression>node);
                    case SyntaxKind.BinaryExpression:
                        return emitBinaryExpression(<BinaryExpression>node);
                    case SyntaxKind.ConditionalExpression:
                        return emitConditionalExpression(<ConditionalExpression>node);
                    case SyntaxKind.TemplateExpression:
                        return emitTemplateExpression(<TemplateExpression>node);
                    case SyntaxKind.YieldExpression:
                        return emitYieldExpression(<YieldExpression>node);
                    case SyntaxKind.SpreadElementExpression:
                        return emitSpreadElementExpression(<SpreadElementExpression>node);
                    case SyntaxKind.ClassExpression:
                        return emitClassExpression(<ClassExpression>node);
                    case SyntaxKind.OmittedExpression:
                        return;
                    case SyntaxKind.AsExpression:
                        return emitAsExpression(<AsExpression>node);
                    case SyntaxKind.NonNullExpression:
                        return emitNonNullExpression(<NonNullExpression>node);

                    // JSX (non-expression)
                    case SyntaxKind.JsxText:
                        return;
                    case SyntaxKind.JsxOpeningElement:
                        return;
                    case SyntaxKind.JsxClosingElement:
                        return;
                    case SyntaxKind.JsxAttribute:
                        return;
                    case SyntaxKind.JsxSpreadAttribute:
                        return;
                    case SyntaxKind.JsxExpression:
                        return;

                    // Clauses
                    case SyntaxKind.CaseClause:
                        return emitCaseClause(<CaseClause>node);
                    case SyntaxKind.DefaultClause:
                        return emitDefaultClause(<DefaultClause>node);
                    case SyntaxKind.HeritageClause:
                        return emitHeritageClause(<HeritageClause>node);
                    case SyntaxKind.CatchClause:
                        return emitCatchClause(<CatchClause>node);

                    // Property assignments
                    case SyntaxKind.PropertyAssignment:
                        return emitPropertyAssignment(<PropertyAssignment>node);
                    case SyntaxKind.ShorthandPropertyAssignment:
                        return emitShorthandPropertyAssignment(<ShorthandPropertyAssignment>node);

                    // Enum
                    case SyntaxKind.EnumMember:
                        return emitEnumMember(<EnumMember>node);

                    // JSDoc nodes (ignored)
                    // Transformation nodes (ignored)
                }
            }
        }
    }

    /*function createBracketsMap() {
        const brackets: string[][] = [];
        brackets[ListFormat.Braces] = ["{", "}"];
        brackets[ListFormat.Parenthesis] = ["(", ")"];
        brackets[ListFormat.AngleBrackets] = ["<", ">"];
        brackets[ListFormat.SquareBrackets] = ["[", "]"];
        return brackets;
    }

    function getOpeningBracket(format: ListFormat) {
        return brackets[format & ListFormat.BracketsMask][0];
    }

    function getClosingBracket(format: ListFormat) {
        return brackets[format & ListFormat.BracketsMask][1];
    }*/

    const enum ListFormat {
        None = 0,

        // Line separators
        SingleLine = 0,                 // Prints the list on a single line (default).
        MultiLine = 1 << 0,             // Prints the list on multiple lines.
        PreserveLines = 1 << 1,         // Prints the list using line preservation if possible.
        LinesMask = SingleLine | MultiLine | PreserveLines,

        // Delimiters
        NotDelimited = 0,               // There is no delimiter between list items (default).
        BarDelimited = 1 << 2,          // Each list item is space-and-bar (" |") delimited.
        AmpersandDelimited = 1 << 3,    // Each list item is space-and-ampersand (" &") delimited.
        CommaDelimited = 1 << 4,        // Each list item is comma (",") delimited.
        DelimitersMask = BarDelimited | AmpersandDelimited | CommaDelimited,

        AllowTrailingComma = 1 << 5,    // Write a trailing comma (",") if present.

        // Whitespace
        Indented = 1 << 6,              // The list should be indented.
        SpaceBetweenBraces = 1 << 7,    // Inserts a space after the opening brace and before the closing brace.
        SpaceBetweenSiblings = 1 << 8,  // Inserts a space between each sibling node.

        // Brackets/Braces
        Braces = 1 << 9,                 // The list is surrounded by "{" and "}".
        Parenthesis = 1 << 10,          // The list is surrounded by "(" and ")".
        AngleBrackets = 1 << 11,        // The list is surrounded by "<" and ">".
        SquareBrackets = 1 << 12,       // The list is surrounded by "[" and "]".
        BracketsMask = Braces | Parenthesis | AngleBrackets | SquareBrackets,

        OptionalIfUndefined = 1 << 13,  // Do not emit brackets if the list is undefined.
        OptionalIfEmpty = 1 << 14,      // Do not emit brackets if the list is empty.
        Optional = OptionalIfUndefined | OptionalIfEmpty,

        // Other
        PreferNewLine = 1 << 15,        // Prefer adding a LineTerminator between synthesized nodes.
        NoTrailingNewLine = 1 << 16,    // Do not emit a trailing NewLine for a MultiLine list.
        NoInterveningComments = 1 << 17, // Do not emit comments between each node

        // Precomputed Formats
        Modifiers = SingleLine | SpaceBetweenSiblings,
        HeritageClauses = SingleLine | SpaceBetweenSiblings,
        TypeLiteralMembers = MultiLine | Indented,
        TupleTypeElements = CommaDelimited | SpaceBetweenSiblings | SingleLine | Indented,
        UnionTypeConstituents = BarDelimited | SpaceBetweenSiblings | SingleLine,
        IntersectionTypeConstituents = AmpersandDelimited | SpaceBetweenSiblings | SingleLine,
        ObjectBindingPatternElements = SingleLine | AllowTrailingComma | SpaceBetweenBraces | CommaDelimited | SpaceBetweenSiblings,
        ArrayBindingPatternElements = SingleLine | AllowTrailingComma | CommaDelimited | SpaceBetweenSiblings,
        ObjectLiteralExpressionProperties = PreserveLines | CommaDelimited | SpaceBetweenSiblings | SpaceBetweenBraces | Indented | Braces,
        ArrayLiteralExpressionElements = PreserveLines | CommaDelimited | SpaceBetweenSiblings | AllowTrailingComma | Indented | SquareBrackets,
        CallExpressionArguments = CommaDelimited | SpaceBetweenSiblings | SingleLine | Parenthesis,
        NewExpressionArguments = CommaDelimited | SpaceBetweenSiblings | SingleLine | Parenthesis | OptionalIfUndefined,
        TemplateExpressionSpans = SingleLine | NoInterveningComments,
        SingleLineBlockStatements = SpaceBetweenBraces | SpaceBetweenSiblings | SingleLine,
        MultiLineBlockStatements = Indented | MultiLine,
        VariableDeclarationList = CommaDelimited | SpaceBetweenSiblings | SingleLine,
        SingleLineFunctionBodyStatements = SingleLine | SpaceBetweenSiblings | SpaceBetweenBraces,
        MultiLineFunctionBodyStatements = MultiLine,
        ClassHeritageClauses = SingleLine | SpaceBetweenSiblings,
        ClassMembers = Indented | MultiLine,
        InterfaceMembers = Indented | MultiLine,
        EnumMembers = CommaDelimited | Indented | MultiLine,
        CaseBlockClauses = Indented | MultiLine,
        NamedImportsOrExportsElements = CommaDelimited | SpaceBetweenSiblings | AllowTrailingComma | SingleLine | SpaceBetweenBraces,
        JsxElementChildren = SingleLine | NoInterveningComments,
        JsxElementAttributes = SingleLine | SpaceBetweenSiblings | NoInterveningComments,
        CaseOrDefaultClauseStatements = Indented | MultiLine | NoTrailingNewLine | OptionalIfEmpty,
        HeritageClauseTypes = CommaDelimited | SpaceBetweenSiblings | SingleLine,
        SourceFileStatements = MultiLine | NoTrailingNewLine,
        Decorators = MultiLine | Optional,
        TypeArguments = CommaDelimited | SpaceBetweenSiblings | SingleLine | Indented | AngleBrackets | Optional,
        TypeParameters = CommaDelimited | SpaceBetweenSiblings | SingleLine | Indented | AngleBrackets | Optional,
        Parameters = CommaDelimited | SpaceBetweenSiblings | SingleLine | Indented | Parenthesis,
        IndexSignatureParameters = CommaDelimited | SpaceBetweenSiblings | SingleLine | Indented | SquareBrackets,
    }

    function isSingleLineEmptyBlock(block: Block) {
        return !block.multiLine
            && isEmptyBlock(block);
    }

    function isEmptyBlock(block: BlockLike) {
        return block.statements.length === 0;
    }

    function createDelimiterMap() {
        const delimiters: string[] = [];
        delimiters[ListFormat.None] = "";
        delimiters[ListFormat.CommaDelimited] = ",";
        delimiters[ListFormat.BarDelimited] = " |";
        delimiters[ListFormat.AmpersandDelimited] = " &";
        return delimiters;
    }

    function createBracketsMap() {
        const brackets: string[][] = [];
        brackets[ListFormat.Braces] = ["{", "}"];
        brackets[ListFormat.Parenthesis] = ["(", ")"];
        brackets[ListFormat.AngleBrackets] = ["<", ">"];
        brackets[ListFormat.SquareBrackets] = ["[", "]"];
        return brackets;
    }

    const brackets = createBracketsMap();
    
    function getOpeningBracket(format: ListFormat) {
        return brackets[format & ListFormat.BracketsMask][0];
    }

    function getClosingBracket(format: ListFormat) {
        return brackets[format & ListFormat.BracketsMask][1];
    }

    const delimeters = createDelimiterMap();

    function getDelimiter(format: ListFormat) {
        return delimeters[format & ListFormat.DelimitersMask];
    }
}
